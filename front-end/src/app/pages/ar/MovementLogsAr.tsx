import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Search, Download, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

interface MovementLog {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  kitchen: string;
  from: string;
  to: string;
  performedBy: string;
  date: string;
  notes: string;
}

const logsData: MovementLog[] = [
  { id: 'LOG-001', itemId: 'INV-001', itemName: 'أرز', type: 'in', quantity: 500, kitchen: 'صندوق', from: 'المورد الخارجي', to: 'المستودع A', performedBy: 'مشرف المخزن أحمد', date: '2026-05-04', notes: 'استلام دوري شهري' },
  { id: 'LOG-002', itemId: 'INV-002', itemName: 'جبن', type: 'out', quantity: 30, kitchen: 'حقيبة', from: 'المستودع B', to: 'المطبخ المركزي', performedBy: 'منسق التوريد خالد', date: '2026-05-03', notes: 'توزيع على الوحدة' },
  { id: 'LOG-003', itemId: 'INV-003', itemName: 'زجاجات مياه', type: 'transfer', quantity: 1000, kitchen: 'قرص', from: 'المستودع A', to: 'المستودع C', performedBy: 'مشرفة المخزون سلمى', date: '2026-05-02', notes: 'نقل بسبب اكتظاظ المستودع A' },
  { id: 'LOG-004', itemId: 'INV-001', itemName: 'أرز', type: 'out', quantity: 200, kitchen: 'صندوق', from: 'المستودع A', to: 'مطبخ الخضروات', performedBy: 'مشرفة المخزون فاطمة', date: '2026-05-01', notes: 'طلب طارئ' },
  { id: 'LOG-005', itemId: 'INV-006', itemName: 'فاصوليا', type: 'in', quantity: 150, kitchen: 'قطعة', from: 'مورد الأغذية الرئيسي', to: 'المستودع A', performedBy: 'مدير المخزون يوسف', date: '2026-04-30', notes: '' },
];

const typeLabels: Record<string, string> = { in: 'وارد', out: 'صادر', transfer: 'نقل' };
const typeVariants: Record<string, any> = { in: 'success', out: 'danger', transfer: 'info' };
const TypeIcon = ({ type }: { type: string }) => {
  if (type === 'in') return <ArrowDownLeft className="w-4 h-4 text-[#6A7B4D]" />;
  if (type === 'out') return <ArrowUpRight className="w-4 h-4 text-[#B85C50]" />;
  return <RefreshCw className="w-4 h-4 text-[#4B5B3A]" />;
};

export const MovementLogsAr = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = logsData.filter((log) => {
    const matchSearch = log.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="سجل حركة المخزون"
        subtitle="تتبع جميع عمليات الوارد والصادر والنقل"
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث باسم الصنف أو رقم السجل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 text-right"
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'جميع أنواع الحركة' },
              { value: 'in', label: 'وارد' },
              { value: 'out', label: 'صادر' },
              { value: 'transfer', label: 'نقل داخلي' },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          عرض {filtered.length} من {logsData.length} سجل
        </p>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          تصدير السجل
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'إجمالي الوارد', count: logsData.filter(l => l.type === 'in').length, color: 'bg-[#6A7B4D]' },
          { label: 'إجمالي الصادر', count: logsData.filter(l => l.type === 'out').length, color: 'bg-[#B85C50]' },
          { label: 'عمليات النقل', count: logsData.filter(l => l.type === 'transfer').length, color: 'bg-[#4B5B3A]' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 text-center">
              <div className={`${s.color} text-white text-2xl font-bold rounded-xl py-2 mb-2`}>{s.count}</div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile card list */}
      <div className="lg:hidden space-y-3">
        {filtered.map((log) => (
          <div key={log.id} className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={typeVariants[log.type]}>{typeLabels[log.type]}</Badge>
              <div className="flex items-center gap-2 flex-row-reverse">
                <TypeIcon type={log.type} />
                <p className="font-semibold text-foreground text-right">{log.itemName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-right">
              <div><p className="text-muted-foreground">الكمية</p><p className="font-medium">{log.quantity} {log.kitchen}</p></div>
              <div><p className="text-muted-foreground">التاريخ</p><p className="font-medium">{log.date}</p></div>
              <div><p className="text-muted-foreground">من</p><p className="font-medium">{log.from}</p></div>
              <div><p className="text-muted-foreground">إلى</p><p className="font-medium">{log.to}</p></div>
            </div>
            {log.notes && <p className="text-xs text-muted-foreground mt-2 text-right">{log.notes}</p>}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {['رقم السجل', 'الصنف', 'النوع', 'الكمية', 'من', 'إلى', 'منفّذ بواسطة', 'التاريخ'].map((h) => (
                <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-mono text-sm font-medium">{log.id}</td>
                <td className="px-4 py-3 text-foreground">{log.itemName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-row-reverse justify-end">
                    <TypeIcon type={log.type} />
                    <Badge variant={typeVariants[log.type]}>{typeLabels[log.type]}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3">{log.quantity} {log.kitchen}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.from}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.to}</td>
                <td className="px-4 py-3 text-foreground">{log.performedBy}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


