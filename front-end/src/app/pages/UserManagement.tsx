import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { UserPlus, Search, MoreVertical } from 'lucide-react';
import { api } from '../lib/api';
import { UserDoc } from '../lib/types';
import { useApiResource } from '../lib/useApiResource';
import { formatDate } from '../lib/format';

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, loading, error } = useApiResource<UserDoc>(() => api.users.list(), []);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.military_number.toLowerCase().includes(search)
    );
  });

  const columns = [
    { key: 'military_number', header: 'Employee Code' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row: UserDoc) => (
        <Badge variant={row.role === 'admin' ? 'info' : 'neutral'}>
          {row.role === 'admin' ? 'Admin' : 'Kitchen'}
        </Badge>
      ),
    },
    { key: 'phone', header: 'Phone' },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: UserDoc) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="p-2 hover:bg-[#E0E1B7] rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage user accounts and permissions from MongoDB"
        action={{ label: 'Add User', onClick: () => {}, icon: UserPlus }}
      />

      <div className="mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B50]" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <p className="text-sm text-[#5A6B50]">
        {loading ? 'Loading users from MongoDB...' : error || `${filteredUsers.length} users loaded`}
      </p>
      <Table
        columns={columns}
        data={loading ? [] : filteredUsers}
        emptyMessage={error || 'No MongoDB users found. Run npm run seed in the backend.'}
      />
    </div>
  );
};

