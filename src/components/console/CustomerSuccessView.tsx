'use client';

import React from 'react';
import { 
  Heart, 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  UserPlus 
} from 'lucide-react';

export default function CustomerSuccessView({ contacts }: { contacts: any[] }) {
  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-5 flex justify-between items-center">
          <div>
            <span className="text-text-secondary font-semibold text-xs">CS Average Net Promoter</span>
            <h4 className="text-2xl font-extrabold text-text-primary mt-1">8.6/10</h4>
            <span className="text-[10px] text-success font-bold">+0.4 YoY</span>
          </div>
          <div className="w-10 h-10 bg-success-light text-success rounded-lg flex items-center justify-center border border-success-border">
            <Heart className="w-5 h-5 fill-[var(--success)]" />
          </div>
        </div>

        <div className="premium-card p-5 flex justify-between items-center">
          <div>
            <span className="text-text-secondary font-semibold text-xs">Projected Renewal Rate</span>
            <h4 className="text-2xl font-extrabold text-text-primary mt-1">94.2%</h4>
            <span className="text-[10px] text-info font-bold">Target: 95.0%</span>
          </div>
          <div className="w-10 h-10 bg-info-light text-info rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
        </div>

        <div className="premium-card p-5 flex justify-between items-center">
          <div>
            <span className="text-text-secondary font-semibold text-xs">At-Risk Churn Contracts</span>
            <h4 className="text-2xl font-extrabold text-text-primary mt-1">1 Account</h4>
            <span className="text-[10px] text-error font-bold">12% Churn Probability</span>
          </div>
          <div className="w-10 h-10 bg-error-light text-error rounded-lg flex items-center justify-center border border-error-border">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Accounts Health Grid */}
      <div className="premium-card p-5 space-y-4">
        <h4 className="font-bold text-sm text-text-primary">Enterprise Accounts Health Index</h4>
        
        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-bg-alt border-b border-border-default text-text-secondary font-bold uppercase tracking-widest text-[9px]">
                <th className="p-3">Client Entity</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Latest NPS</th>
                <th className="p-3">Churn Warning Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-text-primary">
              {contacts?.map((contact) => (
                <tr key={contact.id} className="hover:bg-surface-bg-alt">
                  <td className="p-3 font-bold text-text-primary">{contact.companyName} &bull; {contact.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        contact.healthScore >= 80 ? 'bg-success' : contact.healthScore >= 50 ? 'bg-warning' : 'bg-error'
                      }`}></span>
                      {contact.healthScore}% health index
                    </div>
                  </td>
                  <td className="p-3 font-bold">{contact.nps ? `${contact.nps}/10` : 'N/A'}</td>
                  <td className="p-3">
                    {contact.healthScore < 50 ? (
                      <span className="badge-error flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Churn Risk
                      </span>
                    ) : (
                      <span className="badge-success flex items-center gap-1 w-fit">
                        <Heart className="w-3.5 h-3.5 fill-[var(--success)]" /> Secure
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
