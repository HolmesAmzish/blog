/**
 * Admin Users Page
 * User management for admin panel
 */
import { useState } from 'react';
import { useUsers, useDeleteUser, useUpdateUserRole, useSetUserEnabled } from '../../hooks/useUsers';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, User, UserCheck, UserX } from 'lucide-react';
import type { UserRole } from '../../types';

/**
 * Admin Users Page Component
 */
export function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const setEnabled = useSetUserEnabled();
  
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<'enabled' | 'disabled' | ''>('');

  const filteredUsers = users?.filter((user) => {
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'enabled' && user.isEnabled) ||
      (statusFilter === 'disabled' && !user.isEnabled);
    return matchesRole && matchesStatus;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      case 'EDITOR':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
              USERS
            </h1>
            <p className="text-gray-500 text-sm font-mono mt-1">
              Manage user accounts
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            New User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
              className="px-4 py-2 border border-gray-200 text-sm font-mono focus:outline-none focus:border-[#0047FF] bg-white"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
              <option value="USER">User</option>
              <option value="GUEST">Guest</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'enabled' | 'disabled' | '')}
              className="px-4 py-2 border border-gray-200 text-sm font-mono focus:outline-none focus:border-[#0047FF] bg-white"
            >
              <option value="">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>

            {/* Reset */}
            <button
              onClick={() => {
                setRoleFilter('');
                setStatusFilter('');
              }}
              className="px-4 py-2 border border-gray-200 text-sm font-mono text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="col-span-4 text-xs font-mono uppercase tracking-wider text-gray-500">
              User
            </div>
            <div className="col-span-2 text-xs font-mono uppercase tracking-wider text-gray-500">
              Role
            </div>
            <div className="col-span-2 text-xs font-mono uppercase tracking-wider text-gray-500">
              Status
            </div>
            <div className="col-span-2 text-xs font-mono uppercase tracking-wider text-gray-500">
              Created
            </div>
            <div className="col-span-2 text-xs font-mono uppercase tracking-wider text-gray-500 text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
              Loading users...
            </div>
          ) : filteredUsers?.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
              No users found
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers?.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                  <div className="col-span-4 flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-mono text-black font-medium">
                        {user.displayName || user.username}
                      </p>
                      <p className="text-xs font-mono text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole.mutate({ id: user.id!, role: e.target.value })}
                      className={`px-2 py-1 text-xs font-mono ${getRoleColor(user.role)} border-none cursor-pointer`}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="USER">USER</option>
                      <option value="GUEST">GUEST</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <button
                      onClick={() => setEnabled.mutate({ id: user.id!, enabled: !user.isEnabled })}
                      className={`flex items-center gap-1 px-2 py-1 text-xs font-mono ${
                        user.isEnabled
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {user.isEnabled ? (
                        <>
                          <UserCheck size={14} />
                          Enabled
                        </>
                      ) : (
                        <>
                          <UserX size={14} />
                          Disabled
                        </>
                      )}
                    </button>
                  </div>
                  <div className="col-span-2 text-sm font-mono text-gray-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-[#0047FF] transition-colors">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this user?')) {
                          deleteUser.mutate(user.id!);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}