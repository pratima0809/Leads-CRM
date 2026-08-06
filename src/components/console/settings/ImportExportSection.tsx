'use client';

import React, { useRef } from 'react';
import { Download, Upload, Database, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard } from './SettingsField';

export default function ImportExportSection() {
  const { importExport, updateImportExport } = useSettingsStore();
  const importRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    const blob = new Blob(['Name,Email,Phone\nSarah,sarah@leadsphere.io,+91 98765 43210'], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackup = () => {
    const data = JSON.stringify(localStorage.getItem('leadsphere-settings'));
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadsphere-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    updateImportExport({ lastBackup: new Date().toISOString() });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('CSV imported:', reader.result);
      };
      reader.readAsText(file);
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          localStorage.setItem('leadsphere-settings', data);
          window.location.reload();
        } catch {
          console.error('Invalid backup file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <SettingsSection title="Import & Export" desc="Backup, restore, and transfer your data">
      <SettingsCard>
        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Import CSV</span>
            <p className="text-[10px] text-text-muted mt-0.5">Import leads and contacts from a CSV file</p>
          </div>
          <button
            onClick={() => importRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>
          <input ref={importRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Export CSV</span>
            <p className="text-[10px] text-text-muted mt-0.5">Export your data as a CSV file</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border-default/50">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Backup Settings</span>
            <p className="text-[10px] text-text-muted mt-0.5">
              {importExport.lastBackup
                ? `Last backup: ${new Date(importExport.lastBackup).toLocaleDateString()}`
                : 'No backup yet'}
            </p>
          </div>
          <button
            onClick={handleBackup}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            Backup
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="min-w-0 pr-4">
            <span className="text-xs font-medium text-text-primary">Restore Settings</span>
            <p className="text-[10px] text-text-muted mt-0.5">Restore from a previous backup file</p>
          </div>
          <button
            onClick={() => restoreRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restore
          </button>
          <input ref={restoreRef} type="file" accept=".json" onChange={handleRestore} className="hidden" />
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
