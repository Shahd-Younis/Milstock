import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Search, Filter, Download, Shield } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: 'inventory' | 'request' | 'user' | 'system' | 'security';
  details: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

const auditData: AuditLog[] = [
  { id: 'AUD-5234', timestamp: '2026-05-03 09:15:42', user: 'Admin User', role: 'Administrator', action: 'Added Inventory Item', category: 'inventory', details: 'Added 500 boxes of Rice to Warehouse A', ipAddress: '192.168.1.100', status: 'success' },
  { id: 'AUD-5233', timestamp: '2026-05-03 08:45:12', user: 'J. Mitchell', role: 'Kitchen User', action: 'Created Request', category: 'request', details: 'Created supply request REQ-1234 for Central Kitchen', ipAddress: '192.168.1.150', status: 'success' },
  { id: 'AUD-5232', timestamp: '2026-05-02 16:30:05', user: 'Warehouse Supervisor', role: 'Manager', action: 'Approved Request', category: 'request', details: 'Approved request REQ-1230 - 500 boxes Rice', ipAddress: '192.168.1.110', status: 'success' },
  { id: 'AUD-5231', timestamp: '2026-05-02 14:22:18', user: 'Admin User', role: 'Administrator', action: 'Updated User Permissions', category: 'user', details: 'Modified permissions for user S. Connor', ipAddress: '192.168.1.100', status: 'success' },
  { id: 'AUD-5230', timestamp: '2026-05-02 11:05:33', user: 'Unknown', role: 'N/A', action: 'Failed Login Attempt', category: 'security', details: 'Multiple failed login attempts detected', ipAddress: '192.168.1.200', status: 'failed' },
  { id: 'AUD-5229', timestamp: '2026-05-01 17:45:27', user: 'Admin User', role: 'Administrator', action: 'System Configuration', category: 'system', details: 'Updated low stock threshold to 20%', ipAddress: '192.168.1.100', status: 'success' },
  { id: 'AUD-5228', timestamp: '2026-05-01 15:12:44', user: 'Warehouse Supervisor', role: 'Manager', action: 'Transferred Inventory', category: 'inventory', details: 'Transferred 150 Milks from Warehouse B to Warehouse A', ipAddress: '192.168.1.110', status: 'success' },
  { id: 'AUD-5227', timestamp: '2026-05-01 10:30:15', user: 'M. Davis', role: 'Kitchen User', action: 'Viewed Inventory', category: 'inventory', details: 'Accessed inventory list page', ipAddress: '192.168.1.160', status: 'success' },
];

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = auditData.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    { key: 'id', header: 'Log ID' },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row: AuditLog) => (
        <div className="text-sm">
          <p className="font-medium text-[#2E3A24]">{row.timestamp.split(' ')[0]}</p>
          <p className="text-[#5A6B50]">{row.timestamp.split(' ')[1]}</p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (row: AuditLog) => (
        <div>
          <p className="font-medium text-[#2E3A24]">{row.user}</p>
          <p className="text-xs text-[#5A6B50]">{row.role}</p>
        </div>
      ),
    },
    { key: 'action', header: 'Action' },
    {
      key: 'category',
      header: 'Category',
      render: (row: AuditLog) => {
        const variantMap = { inventory: 'info' as const, request: 'success' as const, user: 'warning' as const, system: 'neutral' as const, security: 'danger' as const };
        return <Badge variant={variantMap[row.category]}>{row.category}</Badge>;
      },
    },
    { key: 'details', header: 'Details', render: (row: AuditLog) => <span className="text-sm text-[#5A6B50]">{row.details}</span> },
    { key: 'ipAddress', header: 'IP Address' },
    {
      key: 'status',
      header: 'Status',
      render: (row: AuditLog) => <Badge variant={row.status === 'success' ? 'success' : 'danger'}>{row.status}</Badge>,
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader title="Audit Logs" subtitle="Comprehensive system activity and security monitoring" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Shield, label: 'Total Logs (24h)', value: auditData.length, color: 'bg-[#4B5B3A]/10 border-[#4B5B3A]/20 text-[#4B5B3A]' },
          { icon: Shield, label: 'Successful Actions', value: auditData.filter(l => l.status === 'success').length, color: 'bg-[#5B8A4A]/10 border-[#5B8A4A]/20 text-[#5B8A4A]' },
          { icon: Shield, label: 'Failed Actions', value: auditData.filter(l => l.status === 'failed').length, color: 'bg-[#D4183D]/8 border-[#D4183D]/15 text-[#D4183D]' },
          { icon: Shield, label: 'Security Events', value: auditData.filter(l => l.category === 'security').length, color: 'bg-[#B8862A]/10 border-[#B8862A]/20 text-[#B8862A]' },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 rounded-2xl border ${stat.color} bg-white border-[#4E4631]/10 shadow-sm`}>
            <p className="text-xs font-medium text-[#5A6B50] mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-[#2E3A24]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B50]" />
              <Input placeholder="Search logs by user, action, or details..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Select options={[{ value: 'all', label: 'All Categories' }, { value: 'inventory', label: 'Inventory' }, { value: 'request', label: 'Requests' }, { value: 'user', label: 'User Mgmt' }, { value: 'system', label: 'System' }, { value: 'security', label: 'Security' }]} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
          <Select options={[{ value: 'all', label: 'All Status' }, { value: 'success', label: 'Success' }, { value: 'failed', label: 'Failed' }]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
          <Input type="date" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5A6B50]">
          Showing <span className="font-semibold text-[#2E3A24]">{filteredData.length}</span> of {auditData.length} audit logs
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-3.5 h-3.5" /> Filters</Button>
          <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Export</Button>
        </div>
      </div>

      <Table columns={columns} data={filteredData} />
    </div>
  );
};
