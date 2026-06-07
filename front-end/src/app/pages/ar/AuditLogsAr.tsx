import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Search, Download, Shield, User, Package, Settings, FileText } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  module: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const auditData: AuditLog[] = [
  { id: 'AUD-001', action: 'تسجيل دخول', module: 'المصادقة', performedBy: 'مدير المخزون يوسف', role: 'مسؤول', ipAddress: '192.168.1.10', timestamp: '2026-05-05 08:32', status: 'success', details: 'تسجيل دخول ناجح من الجهاز الرئيسي' },
  { id: 'AUD-002', action: 'تعديل صنف', module: 'المخزون', performedBy: 'مشرف المخزن أحمد', role: 'مستودع', ipAddress: '192.168.1.22', timestamp: '2026-05-05 09:15', status: 'success', details: 'تحديث كمية INV-003 من 4000 إلى 5000' },
  { id: 'AUD-003', action: 'الموافقة على طلب', module: 'الطلبات', performedBy: 'مدير المخزون يوسف', role: 'مسؤول', ipAddress: '192.168.1.10', timestamp: '2026-05-05 10:01', status: 'success', details: 'الموافقة على REQ-1233' },
  { id: 'AUD-004', action: 'محاولة دخول فاشلة', module: 'المصادقة', performedBy: 'مجهول', role: '—', ipAddress: '10.0.0.55', timestamp: '2026-05-04 23:14', status: 'failed', details: 'كلمة مرور خاطئة 3 مرات متتالية' },
  { id: 'AUD-005', action: 'تصدير تقرير', module: 'التقارير', performedBy: 'مديرة المخزون سارة', role: 'مسؤول', ipAddress: '192.168.1.15', timestamp: '2026-05-04 16:45', status: 'success', details: 'تصدير تقرير المخزون الشهري PDF' },
  { id: 'AUD-006', action: 'حذف مستخدم', module: 'إدارة المستخدمين', performedBy: 'مدير المخزون يوسف', role: 'مسؤول', ipAddress: '192.168.1.10', timestamp: '2026-05-04 14:20', status: 'warning', details: 'حذف حساب المستخدم USR-047' },
  { id: 'AUD-007', action: 'تغيير الإعدادات', module: 'النظام', performedBy: 'مدير المخزون يوسف', role: 'مسؤول', ipAddress: '192.168.1.10', timestamp: '2026-05-03 11:00', status: 'success', details: 'تعديل حد التنبيه للمخزون المنخفض' },
];

const statusLabels: Record<string, string> = { success: 'نجاح', failed: 'فشل', warning: 'تحذير' };
const statusVariants: Record<string, any> = { success: 'success', failed: 'danger', warning: 'warning' };
const moduleIcons: Record<string, any> = {
  'المصادقة': Shield, 'المخزون': Package, 'الطلبات': FileText,
  'التقارير': FileText, 'إدارة المستخدمين': User, 'النظام': Settings,
};

export const AuditLogsAr = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = auditData.filter((log) => {
    const matchSearch =
      log.action.includes(searchTerm) ||
      log.performedBy.includes(searchTerm) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchSearch && matchModule && matchStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="سجل العمليات"
        subtitle="مراجعة شاملة لجميع الأنشطة والعمليات على النظام"
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي السجلات (24 ساعة)', value: auditData.length, color: 'border-[#4B5B3A]/20 text-[#4B5B3A]' },
          { label: 'الإجراءات الناجحة', value: auditData.filter(l => l.status === 'success').length, color: 'border-[#5B8A4A]/20 text-[#5B8A4A]' },
          { label: 'الإجراءات الفاشلة', value: auditData.filter(l => l.status === 'failed').length, color: 'border-[#C0392B]/15 text-[#C0392B]' },
          { label: 'الأحداث الأمنية', value: auditData.filter(l => l.module === 'المصادقة').length, color: 'border-[#B8862A]/20 text-[#B8862A]' },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 rounded-2xl border bg-white ${stat.color} shadow-sm text-right`}>
            <p className="text-xs font-medium text-[#5A6B50] mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-[#2E3A24]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث في السجلات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 text-right"
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'جميع الوحدات' },
              { value: 'المصادقة', label: 'المصادقة' },
              { value: 'المخزون', label: 'المخزون' },
              { value: 'الطلبات', label: 'الطلبات' },
              { value: 'التقارير', label: 'التقارير' },
              { value: 'إدارة المستخدمين', label: 'إدارة المستخدمين' },
              { value: 'النظام', label: 'النظام' },
            ]}
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'success', label: 'نجاح' },
              { value: 'failed', label: 'فشل' },
              { value: 'warning', label: 'تحذير' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5A6B50]">
          عرض <span className="font-semibold text-[#2E3A24]">{filtered.length}</span> من {auditData.length} سجل
        </p>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          تصدير السجل
        </Button>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((log) => {
          const Icon = moduleIcons[log.module] || Shield;
          return (
            <div key={log.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={statusVariants[log.status]}>{statusLabels[log.status]}</Badge>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <p className="font-semibold text-foreground">{log.action}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-right mb-2">{log.details}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{log.timestamp}</span>
                <span>{log.performedBy} ({log.role})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {['رقم السجل', 'الإجراء', 'الوحدة', 'منفّذ بواسطة', 'الصلاحية', 'عنوان IP', 'التاريخ والوقت', 'الحالة'].map((h) => (
                  <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => {
                const Icon = moduleIcons[log.module] || Shield;
                return (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm">{log.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{log.action}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-row-reverse justify-end">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{log.module}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{log.performedBy}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.role}</td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.timestamp}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariants[log.status]}>{statusLabels[log.status]}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


