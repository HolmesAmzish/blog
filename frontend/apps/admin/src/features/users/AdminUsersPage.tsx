import { useState } from 'react';
import { useUsers, useDeleteUser, useUpdateUserRole, useSetUserEnabled } from '../../hooks/useUsers';
import { Trash2, User, UserCheck, UserX } from 'lucide-react';
import type { UserRole } from '@/types';

export function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const setEnabled = useSetUserEnabled();

  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<'enabled' | 'disabled' | ''>('');

  const filteredUsers = users?.filter((user) => {
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || (statusFilter === 'enabled' && user.isEnabled) || (statusFilter === 'disabled' && !user.isEnabled);
    return matchesRole && matchesStatus;
  });

  const roleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-[#0a0a0a] dark:bg-white text-white dark:text-black';
      case 'PUBLISHER': return 'bg-[#0047FF] text-white';
      default: return 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#98989d] border border-[#e8e8ed] dark:border-[#3a3a3c]';
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Users</h1>
          <p className="text-[13px] text-[#86868b] mt-1">Manage accounts, roles and access.</p>
        </div>
      </div>

      <div className="admin-card p-4 flex flex-col sm:flex-row gap-3">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as UserRole | '')} className="px-3 py-2.5 rounded-xl bg-[#f5f5f7] border border-transparent text-[13px] focus:outline-none focus:bg-white focus:border-[#e8e8ed] flex-1">
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="PUBLISHER">Publisher</option>
          <option value="USER">User</option>
          <option value="GUEST">Guest</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'enabled' | 'disabled' | '')} className="px-3 py-2.5 rounded-xl bg-[#f5f5f7] border border-transparent text-[13px] focus:outline-none focus:bg-white focus:border-[#e8e8ed] flex-1">
          <option value="">All statuses</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
        {(roleFilter || statusFilter) && (
          <button onClick={() => { setRoleFilter(''); setStatusFilter(''); }} className="px-4 py-2.5 rounded-xl bg-white border border-[#e8e8ed] text-[13px] hover:bg-[#f5f5f7]">Clear</button>
        )}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#fbfbfd] dark:bg-[#111113] border-b border-[#e8e8ed] dark:border-[#2c2c2e] text-[11px] font-medium tracking-wide text-[#86868b] dark:text-[#98989d]">
          <div className="col-span-5">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {isLoading ? (
          <div className="p-10 text-center text-[13px] text-[#86868b]">Loading users…</div>
        ) : filteredUsers?.length === 0 ? (
          <div className="p-10 text-center text-[13px] text-[#86868b]">No users found.</div>
        ) : (
          <div className="divide-y divide-[#e8e8ed] dark:divide-[#2c2c2e]">
            {filteredUsers?.map((u) => (
              <div key={u.id} className="px-6 py-4 flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center hover:bg-[#fbfbfd] dark:hover:bg-[#1c1c1e]">
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  {u.avatar ? <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#e8e8ed] flex items-center justify-center"><User size={14} className="text-[#86868b]" /></div>}
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-[#1d1d1f] truncate">{u.displayName || u.username}</div>
                    <div className="text-[12px] text-[#86868b] truncate">{u.email}</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <select value={u.role} onChange={(e) => updateRole.mutate({ id: u.id!, role: e.target.value })} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border-0 cursor-pointer ${roleBadge(u.role)}`}>
                    <option value="ADMIN">ADMIN</option>
                    <option value="PUBLISHER">PUBLISHER</option>
                    <option value="USER">USER</option>
                    <option value="GUEST">GUEST</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <button onClick={() => setEnabled.mutate({ id: u.id!, enabled: !u.isEnabled })} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${u.isEnabled ? 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30' : 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'}`}>
                    {u.isEnabled ? <><UserCheck size={12} /> Enabled</> : <><UserX size={12} /> Disabled</>}
                  </button>
                </div>
                <div className="col-span-2 text-[12px] text-[#6e6e73]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</div>
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => { if (confirm('Delete this user?')) deleteUser.mutate(u.id!); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 text-[#86868b] hover:text-red-600 dark:hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
