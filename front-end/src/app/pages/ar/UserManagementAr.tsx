import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Shield, User } from 'lucide-react';

interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'warehouse' | 'kitchen';
  kitchen: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

const users: UserEntry[] = [
  { id: 'USR-001', name: 'مدير المخزون يوسف الراشد', email: 'yousuf@milstock.local', role: 'admin', kitchen: 'إدارة المخزون', status: 'active', lastLogin: '2026-05-05 08:32', createdAt: '2025-01-15' },
  { id: 'USR-002', name: 'مشرف المخزن أحمد محمد', email: 'ahmad@milstock.local', role: 'warehouse', kitchen: 'المستودع A', status: 'active', lastLogin: '2026-05-05 09:15', createdAt: '2025-03-10' },
  { id: 'USR-003', name: 'مديرة المخزون سارة خالد', email: 'sara@milstock.local', role: 'admin', kitchen: 'إدارة المخزون', status: 'active', lastLogin: '2026-05-04 16:45', createdAt: '2025-02-20' },
  { id: 'USR-004', name: 'منسق المطبخ محمد علي', email: 'mohammed@milstock.local', role: 'unit', kitchen: 'المطبخ المركزي', status: 'active', lastLogin: '2026-05-04 14:20', createdAt: '2025-04-05' },
  { id: 'USR-005', name: 'منسق التوريد خالد داود', email: 'khaled@milstock.local', role: 'unit', kitchen: 'مطبخ المخبوزات', status: 'inactive', lastLogin: '2026-04-20 10:00', createdAt: '2025-05-01' },
  { id: 'USR-006', name: 'مشرفة المخزن فاطمة نور', email: 'fatima@milstock.local', role: 'warehouse', kitchen: 'المستودع B', status: 'suspended', lastLogin: '2026-03-15 08:00', createdAt: '2025-06-10' },
];

const roleLabels: Record<string, string> = { admin: 'مسؤول', warehouse: 'مشرف مستودع', kitchen: 'مستخدم وحدة' };
const roleVariants: Record<string, any> = { admin: 'danger', warehouse: 'warning', kitchen: 'info' };
const statusLabels: Record<string, string> = { active: 'نشط', inactive: 'غير نشط', suspended: 'موقوف' };
const statusVariants: Record<string, any> = { active: 'success', inactive: 'neutral', suspended: 'danger' };

export const UserManagementAr = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filtered = users.filter((u) => {
    const matchSearch = u.name.includes(searchTerm) || u.email.includes(searchTerm) || u.kitchen.includes(searchTerm);
    const matchRole = selectedRole === 'all' || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="إدارة المستخدمين"
        subtitle="إنشاء وإدارة حسابات المستخدمين وصلاحياتهم"
        action={{ label: 'إضافة مستخدم', onClick: () => {}, icon: Plus }}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'إجمالي المستخدمين', count: users.length, color: 'bg-[#4B5B3A]' },
          { label: 'نشط', count: users.filter(u => u.status === 'active').length, color: 'bg-[#6A7B4D]' },
          { label: 'موقوف / غير نشط', count: users.filter(u => u.status !== 'active').length, color: 'bg-[#B85C50]' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 text-center">
              <div className={`${s.color} text-white text-2xl font-bold rounded-xl py-2 mb-2`}>{s.count}</div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="ابحث بالاسم، البريد، أو الوحدة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12 text-right"
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {[
            { value: 'all', label: 'الكل' },
            { value: 'admin', label: 'مسؤولون' },
            { value: 'warehouse', label: 'مشرفو المستودعات' },
            { value: 'kitchen', label: 'مستخدمو الوحدات' },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedRole(r.value)}
              className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                selectedRole === r.value
                  ? 'bg-[#4B5B3A] text-white'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Badge variant={roleVariants[user.role]}>{roleLabels[user.role]}</Badge>
                    <p className="font-semibold text-foreground">{user.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-[#4B5B3A] hover:bg-[#4B5B3A] hover:text-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={statusVariants[user.status]}>{statusLabels[user.status]}</Badge>
                <p className="text-xs text-muted-foreground">{user.kitchen}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {['المستخدم', 'البريد الإلكتروني', 'الصلاحية', 'الوحدة', 'الحالة', 'آخر دخول', 'إجراءات'].map((h) => (
                <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 flex-row-reverse justify-end">
                    <div className="p-2 bg-[#4B5B3A] bg-opacity-10 rounded-xl">
                      {user.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-[#4B5B3A]" />
                      ) : (
                        <User className="w-4 h-4 text-[#4B5B3A]" />
                      )}
                    </div>
                    <p className="font-medium text-foreground">{user.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3"><Badge variant={roleVariants[user.role]}>{roleLabels[user.role]}</Badge></td>
                <td className="px-4 py-3 text-foreground">{user.kitchen}</td>
                <td className="px-4 py-3"><Badge variant={statusVariants[user.status]}>{statusLabels[user.status]}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.status === 'active' ? (
                      <button className="p-1.5 text-[#C9A961] hover:bg-[#C9A961] hover:text-white rounded-lg transition-colors">
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-1.5 text-[#6A7B4D] hover:bg-[#6A7B4D] hover:text-white rounded-lg transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


