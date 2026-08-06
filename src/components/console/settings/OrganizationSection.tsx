'use client';

import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useSettingsStore } from '@/lib/settingsStore';
import { SettingsSection, SettingsCard, SettingsRow, SettingsInput, SettingsToggle } from './SettingsField';

function TagList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = React.useState('');

  const add = () => {
    if (input.trim() && !items.includes(input.trim())) {
      onChange([...items, input.trim()]);
      setInput('');
    }
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted"
        />
        <button onClick={add} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-surface-bg border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary">
              {item}
              <button onClick={() => remove(i)} className="text-text-muted hover:text-error transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizationSection() {
  const { organization, updateOrganization } = useSettingsStore();

  const addMember = () => {
    const newMember = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', email: '', role: '', status: 'Active' };
    updateOrganization({ teamMembers: [...organization.teamMembers, newMember] });
  };

  const updateMember = (i: number, field: string, value: string) => {
    const updated = organization.teamMembers.map((m, idx) => idx === i ? { ...m, [field]: value } : m);
    updateOrganization({ teamMembers: updated });
  };

  const removeMember = (i: number) => {
    updateOrganization({ teamMembers: organization.teamMembers.filter((_, idx) => idx !== i) });
  };

  const addRole = () => {
    const newRole = { id: crypto.randomUUID?.() || Date.now().toString(), name: '', permissions: [] };
    updateOrganization({ roles: [...organization.roles, newRole] });
  };

  const updateRole = (i: number, field: string, value: string | string[]) => {
    const updated = organization.roles.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    updateOrganization({ roles: updated });
  };

  const removeRole = (i: number) => {
    updateOrganization({ roles: organization.roles.filter((_, idx) => idx !== i) });
  };

  return (
    <SettingsSection title="Organization" desc="Manage your team, roles, departments, and territories">
      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Team Members</span>
          <button onClick={addMember} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Member
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-muted border-b border-border-default/50">
              <th className="text-left font-medium py-2 pr-2">Name</th>
              <th className="text-left font-medium py-2 pr-2">Email</th>
              <th className="text-left font-medium py-2 pr-2">Role</th>
              <th className="text-left font-medium py-2 pr-2">Status</th>
              <th className="w-8 py-2" />
            </tr>
          </thead>
          <tbody>
            {organization.teamMembers.map((m, i) => (
              <tr key={m.id} className="border-b border-border-default/20">
                <td className="py-1.5 pr-2">
                  <SettingsInput value={m.name} onChange={(v) => updateMember(i, 'name', v)} className="w-28" />
                </td>
                <td className="py-1.5 pr-2">
                  <SettingsInput value={m.email} onChange={(v) => updateMember(i, 'email', v)} className="w-36" />
                </td>
                <td className="py-1.5 pr-2">
                  <SettingsInput value={m.role} onChange={(v) => updateMember(i, 'role', v)} className="w-24" />
                </td>
                <td className="py-1.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${m.status === 'Active' ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'}`}>
                      {m.status}
                    </span>
                    <button
                      onClick={() => updateMember(i, 'status', m.status === 'Active' ? 'Inactive' : 'Active')}
                      className="text-[10px] text-accent hover:underline"
                    >
                      Toggle
                    </button>
                  </div>
                </td>
                <td className="py-1.5">
                  <button onClick={() => removeMember(i)} className="text-text-muted hover:text-error transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-primary">Roles</span>
          <button onClick={addRole} className="flex items-center gap-1 bg-accent text-white rounded-lg px-2.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Add Role
          </button>
        </div>
        {organization.roles.map((r, i) => (
          <div key={r.id} className="flex items-start gap-3 py-2 border-b border-border-default/20 last:border-0">
            <div className="flex-1 space-y-1.5">
              <SettingsInput value={r.name} onChange={(v) => updateRole(i, 'name', v)} placeholder="Role name" />
              <input
                value={r.permissions.join(', ')}
                onChange={(e) => updateRole(i, 'permissions', e.target.value.split(',').map((s) => s.trim()))}
                placeholder="Permissions (comma separated)"
                className="w-full bg-surface-bg border border-border-default rounded-lg px-3 py-1.5 text-[10px] text-text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted"
              />
            </div>
            <button onClick={() => removeRole(i)} className="mt-1.5 text-text-muted hover:text-error transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Departments">
          <TagList items={organization.departments} onChange={(v) => updateOrganization({ departments: v })} placeholder="Add department" />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Territories">
          <TagList items={organization.territories} onChange={(v) => updateOrganization({ territories: v })} placeholder="Add territory" />
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}
