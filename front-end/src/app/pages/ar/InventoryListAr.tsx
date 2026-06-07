import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Plus, Search, Filter, Download, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  kitchen: string;
  expirationDate: string;
  warehouse: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expiring-soon';
}

const inventoryData: InventoryItem[] = [
  { id: 'INV-001', name: 'أرز', category: 'غذاء', quantity: 2500, kitchen: 'صندوق', expirationDate: '2027-12-31', warehouse: 'المستودع A', status: 'in-stock' },
  { id: 'INV-002', name: 'جبن', category: 'ألبان', quantity: 150, kitchen: 'حقيبة', expirationDate: '2026-08-15', warehouse: 'المستودع B', status: 'low-stock' },
  { id: 'INV-003', name: 'زجاجات مياه', category: 'أغذية', quantity: 5000, kitchen: 'قرص', expirationDate: '2026-06-30', warehouse: 'المستودع A', status: 'expiring-soon' },
  { id: 'INV-004', name: 'خبز', category: 'مخبوزات', quantity: 500, kitchen: 'زوج', expirationDate: 'لا ينطبق', warehouse: 'المستودع C', status: 'in-stock' },
  { id: 'INV-005', name: 'مياه معبأة', category: 'غذاء', quantity: 0, kitchen: 'قارورة', expirationDate: '2026-09-01', warehouse: 'المستودع B', status: 'out-of-stock' },
  { id: 'INV-006', name: 'فاصوليا', category: 'ألبان', quantity: 320, kitchen: 'قطعة', expirationDate: '2028-03-15', warehouse: 'المستودع A', status: 'in-stock' },
];

const statusLabels: Record<string, string> = {
  'in-stock': 'متوفر',
  'low-stock': 'مخزون منخفض',
  'out-of-stock': 'نفد المخزون',
  'expiring-soon': 'ينتهي قريباً',
};

const variantMap: Record<string, any> = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'danger',
  'expiring-soon': 'warning',
};

export const InventoryListAr = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="إدارة المخزون"
        subtitle="تتبع وإدارة جميع أصناف المخزون عبر المستودعات"
        action={{
          label: 'إضافة صنف جديد',
          onClick: () => navigate('/ar/admin/inventory/add'),
          icon: Plus,
        }}
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث باسم الصنف أو الرمز..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 text-right"
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'جميع الفئات' },
              { value: 'غذاء', label: 'غذاء' },
              { value: 'ألبان', label: 'ألبان' },
              { value: 'مخبوزات', label: 'مخبوزات' },
              { value: 'أغذية', label: 'أغذية' },
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'in-stock', label: 'متوفر' },
              { value: 'low-stock', label: 'مخزون منخفض' },
              { value: 'expiring-soon', label: 'ينتهي قريباً' },
              { value: 'out-of-stock', label: 'نفد المخزون' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          عرض {filteredData.length} من {inventoryData.length} صنف
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            فلاتر إضافية
          </Button>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="lg:hidden space-y-3">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors cursor-pointer"
            onClick={() => navigate(`/ar/admin/inventory/${item.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <Badge variant={variantMap[item.status]}>{statusLabels[item.status]}</Badge>
              <div className="text-right">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.id} • {item.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-right">
              <div>
                <p className="text-muted-foreground">الكمية</p>
                <p className="font-medium">{item.quantity} {item.kitchen}</p>
              </div>
              <div>
                <p className="text-muted-foreground">المستودع</p>
                <p className="font-medium">{item.warehouse}</p>
              </div>
              <div>
                <p className="text-muted-foreground">الصلاحية</p>
                <p className="font-medium">{item.expirationDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {['رمز الصنف', 'اسم الصنف', 'الفئة', 'الكمية', 'تاريخ الصلاحية', 'المستودع', 'الحالة', 'إجراءات'].map((h) => (
                  <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => navigate(`/ar/admin/inventory/${item.id}`)}
                >
                  <td className="px-4 py-3 font-mono text-sm font-medium text-foreground">{item.id}</td>
                  <td className="px-4 py-3 text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-foreground">{item.quantity} {item.kitchen}</td>
                  <td className="px-4 py-3 text-foreground">{item.expirationDate}</td>
                  <td className="px-4 py-3 text-foreground">{item.warehouse}</td>
                  <td className="px-4 py-3">
                    <Badge variant={variantMap[item.status]}>{statusLabels[item.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="p-2 hover:bg-[#E0E1B7] rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4 text-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


