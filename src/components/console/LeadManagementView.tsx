'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  Check, 
  X, 
  Send,
  MessageSquare,
  AlertTriangle,
  UploadCloud,
  Layers,
  Database
} from 'lucide-react';
import { useStore } from '@/lib/store';

const SOURCES = [
  'WEBSITE',
  'META_ADS',
  'GOOGLE_ADS',
  'GOOGLE_FORMS',
  'INDIAMART',
  'JUSTDIAL',
  'WHATSAPP',
  'MISSED_CALL',
  'CSV',
  'API'
];

export default function LeadManagementView({ leads, refetchLeads }: { leads: any[], refetchLeads: () => void }) {
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [filterSegment, setFilterSegment] = useState<string>('ALL'); // ALL, HOT (Score > 75), COLD (Score < 50)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddDrawer, setShowAddDrawer] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    source: 'WEBSITE',
    score: 80
  });

  const { triggerMockCallLifecycle } = useStore();

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.firstName || !newLead.lastName) {
      alert("First & Last names are required.");
      return;
    }
    
    try {
      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          collection: 'lead',
          data: {
            firstName: newLead.firstName,
            lastName: newLead.lastName,
            email: newLead.email,
            phone: newLead.phone,
            companyName: newLead.companyName,
            source: newLead.source,
            score: Number(newLead.score),
            status: 'NEW',
            aiRiskScore: Math.floor(Math.random() * 50),
            aiSummary: 'Manually inserted lead from executive dashboard. Standard qualification scheduled.'
          }
        })
      });
      if (response.ok) {
        setShowAddDrawer(false);
        setNewLead({ firstName: '', lastName: '', email: '', phone: '', companyName: '', source: 'WEBSITE', score: 80 });
        refetchLeads();
      } else {
        alert("Failed to insert lead.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter logic
  const filteredLeads = (leads || []).filter((lead) => {
    const matchesSearch = 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSource = filterSource === 'ALL' || lead.source === filterSource;
    
    const matchesSegment = 
      filterSegment === 'ALL' ||
      (filterSegment === 'HOT' && lead.score >= 75) ||
      (filterSegment === 'COLD' && lead.score < 50);

    return matchesSearch && matchesSource && matchesSegment;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-card p-4 border border-border-default rounded-xl shadow-card">
          <div>
            <h3 className="font-bold text-lg text-text-primary">Lead Pipeline Index</h3>
            <p className="text-xs text-text-secondary">Track and qualify leads coming from all integrated sources</p>
          </div>

        <div className="flex gap-3">
          <button 
            onClick={() => alert("Upload lead CSV feature is mocked! To add leads, use the '+ Add Lead' button.")}
            className="inline-flex items-center gap-2 bg-surface-bg-alt hover:bg-surface-bg text-text-secondary px-3 py-2 rounded-lg text-xs font-semibold border border-border-default transition-all hover-lift"
          >
            <UploadCloud className="w-4 h-4" />
            CSV Import
          </button>
          
          <button 
            onClick={() => setShowAddDrawer(true)}
            className="inline-flex items-center gap-2 bg-surface-card dark:bg-sidebar hover:bg-surface-bg-alt dark:hover:bg-sidebar-hover text-text-primary dark:text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all hover-lift"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Grid: Main Table & Segmentations */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Segments and filters */}
        <div className="space-y-4">
          <div className="premium-card p-4 space-y-4">
            <h4 className="font-bold text-sm text-text-primary border-b border-border-default pb-2">Smart Segments</h4>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setFilterSegment('ALL')}
                aria-pressed={filterSegment === 'ALL'}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                  filterSegment === 'ALL' ? 'bg-accent-light text-accent' : 'text-text-secondary hover:bg-surface-bg-alt'
                }`}
              >
                <span>All Active Leads</span>
                <span className="bg-surface-bg-alt px-1.5 py-0.5 rounded text-[10px] text-text-muted font-bold">{leads?.length || 0}</span>
              </button>
              <button
                onClick={() => setFilterSegment('HOT')}
                aria-pressed={filterSegment === 'HOT'}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                  filterSegment === 'HOT' ? 'bg-success-light text-success' : 'text-text-secondary hover:bg-surface-bg-alt'
                }`}
              >
                <span>Hot Leads (Score &ge; 75)</span>
                <span className="badge-success text-[10px] font-bold px-1.5 py-0.5">
                  {leads?.filter(l => l.score >= 75).length || 0}
                </span>
              </button>
              <button
                onClick={() => setFilterSegment('COLD')}
                aria-pressed={filterSegment === 'COLD'}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                  filterSegment === 'COLD' ? 'bg-surface-bg-alt text-text-primary' : 'text-text-secondary hover:bg-surface-bg-alt'
                }`}
              >
                <span>Cold / Unqualified</span>
                <span className="bg-surface-bg-alt text-text-muted px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {leads?.filter(l => l.score < 50).length || 0}
                </span>
              </button>
            </div>
          </div>

          <div className="premium-card p-4 space-y-4">
            <h4 className="font-bold text-sm text-text-primary border-b border-border-default pb-2">Filter by Source</h4>
            <div className="space-y-1">
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full text-xs bg-surface-bg border border-border-default rounded-lg p-2 font-medium text-text-primary"
              >
                <option value="ALL">All Integration Sources</option>
                {SOURCES.map((src) => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right 3 Columns: Table Index */}
        <div className="lg:col-span-3 premium-card overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-border-default flex items-center gap-2 bg-surface-bg">
            <Search className="w-4 h-4 text-icon" />
            <input
              type="text"
              placeholder="Search leads by name, email, or enterprise company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-none w-full text-xs text-text-primary placeholder-text-muted font-medium"
            />
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-bg/50 border-b border-border-default text-text-muted font-bold uppercase tracking-widest text-[9px]">
                  <th className="p-4" scope="col">Lead Info</th>
                  <th className="p-4" scope="col">Enterprise</th>
                  <th className="p-4" scope="col">Lead Source</th>
                  <th className="p-4" scope="col">AI Score</th>
                  <th className="p-4" scope="col">AI Risk Status</th>
                  <th className="p-4 text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-text-secondary">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-surface-bg-alt transition-colors duration-100 hover-scale-subtle cursor-pointer">
                    <td className="p-4">
                      <div className="font-bold text-text-primary text-sm">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-text-muted text-[11px] mt-0.5">{lead.phone || lead.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-text-primary">{lead.companyName || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-surface-bg-alt text-text-secondary font-bold rounded text-[10px]">
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${lead.score >= 75 ? 'bg-success' : 'bg-warning'}`} />
                        {lead.score}/100
                      </div>
                    </td>
                    <td className="p-4">
                      {lead.aiRiskScore > 40 ? (
                        <span className="badge-error text-[9px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> High Risk ({lead.aiRiskScore}%)
                        </span>
                      ) : (
                        <span className="badge-info text-[9px] font-bold inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Low Risk ({lead.aiRiskScore}%)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); triggerMockCallLifecycle(lead.phone || '+1 555 1234', `${lead.firstName} ${lead.lastName}`); }}
                          aria-label={`Call ${lead.firstName} ${lead.lastName}`}
                          className="p-1.5 bg-info-light/30 text-info rounded-lg hover:bg-info-light/50 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-text-muted">
                      No matching leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Manual Insert Lead Drawer Modal */}
      {showAddDrawer && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end animate-fadeIn"
          onKeyDown={(e) => e.key === 'Escape' && setShowAddDrawer(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-lead-title"
        >
          <div className="w-full max-w-md bg-surface-card h-full p-6 shadow-xl flex flex-col justify-between border-l border-border-default animate-slideInRight">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border-default pb-4">
                <div>
                  <h4 id="add-lead-title" className="font-bold text-base text-text-primary">Add Lead Record</h4>
                  <p className="text-xs text-text-secondary">Capture lead from custom internal channels</p>
                </div>
                <button
                  onClick={() => setShowAddDrawer(false)}
                  aria-label="Close drawer"
                  className="p-1 hover:bg-surface-bg-alt rounded-md text-icon"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="space-y-4 text-xs font-semibold">
                {[
                  { label: 'First Name', key: 'firstName', type: 'text', required: true },
                  { label: 'Last Name', key: 'lastName', type: 'text', required: true },
                  { label: 'Company/Enterprise Name', key: 'companyName', type: 'text', required: false },
                  { label: 'Phone Number', key: 'phone', type: 'text', required: false },
                  { label: 'Email Address', key: 'email', type: 'email', required: false },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-text-secondary block mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={(newLead as any)[field.key]}
                      onChange={(e) => setNewLead({ ...newLead, [field.key]: e.target.value })}
                      required={field.required}
                      className="w-full bg-surface-bg border border-border-default rounded-lg p-2.5 outline-none focus:border-accent text-text-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-text-secondary block mb-1">Lead Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full bg-surface-bg border border-border-default rounded-lg p-2.5 text-text-primary"
                  >
                    {SOURCES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-text-secondary block mb-1">AI Lead Score (Estimated)</label>
                  <input
                    type="number"
                    value={newLead.score}
                    onChange={(e) => setNewLead({ ...newLead, score: Number(e.target.value) })}
                    className="w-full bg-surface-bg border border-border-default rounded-lg p-2.5 outline-none focus:border-accent text-text-primary"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-surface-card dark:bg-sidebar hover:bg-surface-bg-alt dark:hover:bg-sidebar-hover text-text-primary dark:text-white py-3 rounded-lg font-bold shadow-card transition-all"
                  >
                    Create Lead Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lead / Contact Detail Popup */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onKeyDown={(e) => e.key === 'Escape' && setSelectedLead(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-detail-title"
        >
          <div
            className="w-full max-w-lg bg-surface-card rounded-2xl border border-border-default shadow-xl overflow-hidden animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border-default flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent-light/60 dark:bg-accent/20 flex items-center justify-center text-accent font-bold text-base">
                    {`${selectedLead.firstName || '?'}${selectedLead.lastName ? ' ' + selectedLead.lastName[0] : ''}`.trim().slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 id="lead-detail-title" className="font-bold text-base text-text-primary">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </h4>
                    <span className="px-2 py-0.5 bg-surface-bg-alt text-text-secondary font-bold rounded text-[10px]">
                      {selectedLead.status || 'NEW'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                aria-label="Close popup"
                className="p-1.5 hover:bg-surface-bg-alt rounded-md text-icon"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Company / Enterprise', value: selectedLead.companyName || '-' },
                  { label: 'Email', value: selectedLead.email || '-' },
                  { label: 'Phone', value: selectedLead.phone || '-' },
                  { label: 'Lead Source', value: selectedLead.source || '-' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-text-muted font-semibold uppercase tracking-widest text-[9px]">{item.label}</div>
                    <div className="text-text-primary font-bold mt-1 break-words">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="premium-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted font-semibold text-[10px]">AI Score</span>
                    <span className={`w-2 h-2 rounded-full ${selectedLead.score >= 75 ? 'bg-success' : 'bg-warning'}`} />
                  </div>
                  <div className="text-text-primary font-bold text-lg mt-1">{selectedLead.score}/100</div>
                </div>
                <div className="premium-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted font-semibold text-[10px]">AI Risk Status</span>
                    {selectedLead.aiRiskScore > 40 ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-error" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-success" />
                    )}
                  </div>
                  <div className="text-text-primary font-bold text-lg mt-1">
                    {selectedLead.aiRiskScore > 40 ? 'High Risk' : 'Low Risk'} ({selectedLead.aiRiskScore}%)
                  </div>
                </div>
              </div>

              <div>
                <div className="text-text-muted font-semibold uppercase tracking-widest text-[9px] mb-1">AI Summary</div>
                <p className="text-text-secondary leading-relaxed">{selectedLead.aiSummary || 'No AI summary available for this contact.'}</p>
              </div>
            </div>

            <div className="p-6 border-t border-border-default flex justify-end gap-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-surface-bg-alt hover:bg-surface-bg text-text-secondary rounded-lg text-xs font-semibold transition-all"
              >
                Close
              </button>
              <button
                onClick={() => triggerMockCallLifecycle(selectedLead.phone || '+1 555 1234', `${selectedLead.firstName} ${selectedLead.lastName}`)}
                className="inline-flex items-center gap-2 bg-surface-card dark:bg-sidebar hover:bg-surface-bg-alt dark:hover:bg-sidebar-hover text-text-primary dark:text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all hover-lift"
              >
                <Send className="w-3.5 h-3.5" />
                Call Contact
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
