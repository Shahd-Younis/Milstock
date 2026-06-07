import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface Request {
  id: string;
  kitchen: string;
  item: string;
  quantity: number;
  priority: 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  requestedDate: string;
  requestedBy: string;
}

const requestsData: Request[] = [
  { id: 'REQ-1234', kitchen: 'المطبخ المركزي', item: 'أرز', quantity: 500, priority: 'high', status: 'pending', requestedDate: '2026-05-02', requestedBy: 'منسق المطبخ محمد' },
  { id: 'REQ-1233', kitchen: 'مطبخ المخبوزات', item: 'أغذية ألبانة', quantity: 200, priority: 'urgent', status: 'approved', requestedDate: '2026-05-01', requestedBy: 'منسق التوريد خالد' },
  { id: 'REQ-1232', kitchen: 'مطبخ الخضروات', item: 'قوارير مياه', quantity: 1000, priority: 'normal', status: 'delivered', requestedDate: '2026-04-30', requestedBy: 'منسق التوريد داود' },
  { id: 'REQ-1231', kitchen: 'مطبخ الفواكه', item: 'خضروات مجمدة', quantity: 30, priority: 'high', status: 'rejected', requestedDate: '2026-04-29', requestedBy: 'منسقة التوريد سلمى' },
  { id: 'REQ-1230', kitchen: 'مطبخ التخزين', item: 'عدس', quantity: 150, priority: 'urgent', status: 'pending', requestedDate: '2026-04-28', requestedBy: 'منسق التغذية يوسف' },
];

const statusLabels: Record<string, string> = { pending: 'قيد المراجعة', approved: 'موافق عليه', rejected: 'مرفوض', delivered: 'تم التسليم' };
const statusVariants: Record<string, any> = { pending: 'pending', approved: 'success', rejected: 'danger', delivered: 'info' };
const priorityLabels: Record<string, string> = { urgent: 'عاجل', high: 'عالية', normal: 'عادية' };
const priorityVariants: Record<string, any> = { urgent: 'danger', high: 'warning', normal: 'neutral' };

export const RequestsListAr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('/ar/admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = requestsData.filter((req) => {
    const matchSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.kitchen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title={isAdmin ? 'جميع طلبات التوريد' : 'طلباتي'}
        subtitle={isAdmin ? 'مراجعة وإدارة طلبات التوريد من جميع الوحدات' : 'تتبع حالة طلبات التوريد الخاصة بك'}
        action={!isAdmin ? {
          label: 'طلب جديد',
          onClick: () => navigate('/ar/user/requests/create'),
          icon: Plus,
        } : undefined}
      />

      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث برقم الطلب، الوحدة، أو الصنف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 text-right"
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'pending', label: 'قيد المراجعة' },
              { value: 'approved', label: 'موافق عليه' },
              { value: 'rejected', label: 'مرفوض' },
              { value: 'delivered', label: 'تم التسليم' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          عرض {filtered.length} من {requestsData.length} طلب
        </p>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          فلاتر إضافية
        </Button>
      </div>

      {/* Mobile card list */}
      <div className="lg:hidden space-y-3">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="p-4 rounded-xl border border-border bg-card cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate(isAdmin ? `/ar/admin/requests/${req.id}` : `/ar/user/requests/${req.id}`)}
          >
            <div className="flex items-center justify-between mb-3">
              <Badge variant={statusVariants[req.status]}>{statusLabels[req.status]}</Badge>
              <div className="text-right">
                <p className="font-semibold text-foreground">{req.id}</p>
                <p className="text-xs text-muted-foreground">{req.kitchen}</p>
              </div>
            </div>
            <p className="text-sm text-foreground text-right mb-2">{req.item} — الكمية: {req.quantity}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{req.requestedDate}</span>
              <Badge variant={priorityVariants[req.priority]}>{priorityLabels[req.priority]}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {['رقم الطلب', 'الوحدة', 'الصنف', 'الكمية', 'الأولوية', 'الحالة', 'التاريخ', 'مقدّم الطلب'].map((h) => (
                <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => navigate(isAdmin ? `/ar/admin/requests/${req.id}` : `/ar/user/requests/${req.id}`)}
              >
                <td className="px-4 py-3 font-mono text-sm font-medium text-foreground">{req.id}</td>
                <td className="px-4 py-3 text-foreground">{req.kitchen}</td>
                <td className="px-4 py-3 text-foreground">{req.item}</td>
                <td className="px-4 py-3 text-foreground">{req.quantity}</td>
                <td className="px-4 py-3"><Badge variant={priorityVariants[req.priority]}>{priorityLabels[req.priority]}</Badge></td>
                <td className="px-4 py-3"><Badge variant={statusVariants[req.status]}>{statusLabels[req.status]}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{req.requestedDate}</td>
                <td className="px-4 py-3 text-foreground">{req.requestedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


