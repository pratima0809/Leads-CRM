'use client';

import React, { useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle, HardDrive, Info } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow } from './SettingsField';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SystemSection() {
  const { system, updateSystem, resetAll } = useSettingsStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const storageEstimate = typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage
    ? navigator.storage.estimate().then((e) => e.usage || 0).catch(() => 0)
    : Promise.resolve(0);

  const [storageUsage, setStorageUsage] = useState<number | null>(null);

  React.useEffect(() => {
    storageEstimate.then(setStorageUsage);
  }, []);

  const handleCheckUpdates = () => {
    updateSystem({ lastUpdateCheck: new Date().toISOString() });
  };

  return (
    <SettingsSection title="System" desc="System information and maintenance">
      <SettingsCard>
        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Clear Cache</span>
            <p className="text-[10px] text-text-muted mt-0.5">Clear cached data and local storage</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-warning text-warning hover:bg-warning/5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cache
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Reset All Settings</span>
            <p className="text-[10px] text-text-muted mt-0.5">Reset all settings to their defaults</p>
          </div>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                }}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-error text-white hover:bg-error/90 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="text-xs text-text-muted hover:text-text-primary px-2 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-error text-error hover:bg-error/5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All
            </button>
          )}
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Storage Usage</span>
            <p className="text-[10px] text-text-muted mt-0.5">
              {storageUsage !== null ? formatBytes(storageUsage) : 'Calculating...'}
            </p>
          </div>
          <HardDrive className="w-4 h-4 text-text-muted" />
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">App Version</span>
            <p className="text-[10px] text-text-muted mt-0.5">
              {system.lastUpdateCheck
                ? `Last checked: ${new Date(system.lastUpdateCheck).toLocaleDateString()}`
                : 'Never checked for updates'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted">v{system.appVersion}</span>
            <Info className="w-4 h-4 text-text-muted" />
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Check for Updates</span>
            <p className="text-[10px] text-text-muted mt-0.5">Check if a newer version is available</p>
          </div>
          <button
            onClick={handleCheckUpdates}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check Updates
          </button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
