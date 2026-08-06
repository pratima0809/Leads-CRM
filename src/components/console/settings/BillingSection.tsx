'use client';

import React from 'react';
import { Check, Trash2, CreditCard } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow } from './SettingsField';

const statusColors: Record<string, string> = {
  Paid: 'bg-success/10 text-success',
  Pending: 'bg-warning/10 text-warning',
  Overdue: 'bg-error/10 text-error',
  Cancelled: 'bg-text-muted/10 text-text-muted',
};

export default function BillingSection() {
  const { billing, updateBilling } = useSettingsStore();

  const removePaymentMethod = (i: number) => {
    updateBilling({ paymentMethods: billing.paymentMethods.filter((_, idx) => idx !== i) });
  };

  return (
    <SettingsSection title="Billing" desc="View your plan details, invoices, and payment methods">
      <SettingsCard>
        <span className="text-xs font-semibold text-text-primary block mb-3">Current Plan</span>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Plan</label>
            <p className="text-sm font-bold text-text-primary">{billing.plan}</p>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Status</label>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[billing.status] || 'bg-text-muted/10 text-text-muted'}`}>
              {billing.status}
            </span>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Next Billing</label>
            <p className="text-sm font-medium text-text-primary">{billing.nextBilling}</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <span className="text-xs font-semibold text-text-primary block mb-3">Invoices</span>
        {billing.invoices.length > 0 ? (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border-default/50">
                <th className="text-left font-medium py-2 pr-2">Invoice</th>
                <th className="text-left font-medium py-2 pr-2">Date</th>
                <th className="text-left font-medium py-2 pr-2">Amount</th>
                <th className="text-left font-medium py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {billing.invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border-default/20">
                  <td className="py-2 pr-2 text-text-primary font-medium">{inv.id}</td>
                  <td className="py-2 pr-2 text-text-muted">{inv.date}</td>
                  <td className="py-2 pr-2 text-text-primary font-medium">{inv.amount}</td>
                  <td className="py-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[inv.status] || 'bg-text-muted/10 text-text-muted'}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[10px] text-text-muted py-2">No invoices.</p>
        )}
      </SettingsCard>

      <SettingsCard>
        <span className="text-xs font-semibold text-text-primary block mb-3">Usage Limits</span>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Users</label>
            <p className="text-sm font-medium text-text-primary">{billing.usageLimits.users.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Storage</label>
            <p className="text-sm font-medium text-text-primary">{billing.usageLimits.storage}</p>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1">API Calls</label>
            <p className="text-sm font-medium text-text-primary">{billing.usageLimits.apiCalls.toLocaleString()}</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <span className="text-xs font-semibold text-text-primary block mb-3">Payment Methods</span>
        {billing.paymentMethods.length > 0 ? (
          <div className="space-y-2">
            {billing.paymentMethods.map((pm, i) => (
              <div key={pm.id} className="flex items-center justify-between py-2 px-3 bg-surface-bg rounded-lg border border-border-default/50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-text-muted" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text-primary">{pm.type} •••• {pm.last4}</span>
                      {pm.default && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Default</span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-muted">Expires {pm.expiry}</p>
                  </div>
                </div>
                <button
                  onClick={() => removePaymentMethod(i)}
                  className="text-text-muted hover:text-error transition-colors"
                  aria-label="Remove payment method"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-text-muted py-2">No payment methods.</p>
        )}
      </SettingsCard>
    </SettingsSection>
  );
}
