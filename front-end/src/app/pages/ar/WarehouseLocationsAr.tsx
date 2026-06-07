import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { StatCardAr } from '../../components/ar/StatCardAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { MapPin, Package, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  used: number;
  status: 'operational' | 'maintenance' | 'full';
  manager: string;
  categories: string[];
  lastAudit: string;
}

const warehouses: Warehouse[] = [
  {
    id: 'WH-A', name: 'المستودع A', location: 'المنطقة الشمالية، القاعدة الرئيسية',
    capacity: 10000, used: 7500, status: 'operational',
    manager: 'مشرف المخزن أحمد محمد', categories: ['غذاء', 'أغذية'],
    lastAudit: '2026-04-30',
  },
  {
    id: 'WH-B', name: 'المستودع B', location: 'المنطقة الغربية، قسم الإمداد',
    capacity: 8000, used: 6800, status: 'operational',
    manager: 'مديرة المخزون سارة خالد', categories: ['ألبان', 'مخبوزات'],
    lastAudit: '2026-04-28',
  },
  {
    id: 'WH-C', name: 'المستودع C', location: 'المنطقة الجنوبية، نقطة التوزيع',
    capacity: 5000, used: 4900, status: 'full',
    manager: 'مشرف المخزن فيصل عمر', categories: ['مخبوزات', 'أغذية'],
    lastAudit: '2026-05-01',
  },
  {
    id: 'WH-D', name: 'المستودع D', location: 'المنطقة الشرقية، قاعدة دعم',
    capacity: 6000, used: 1200, status: 'maintenance',
    manager: 'مشرفة المخزن نور حسن', categories: ['غذاء'],
    lastAudit: '2026-03-15',
  },
];

const statusLabels: Record<string, string> = {
  operational: 'تشغيلي',
  maintenance: 'صيانة',
  full: 'ممتلئ',
};
const statusVariants: Record<string, any> = {
  operational: 'success',
  maintenance: 'warning',
  full: 'danger',
};

export const WarehouseLocationsAr = () => {
  const total = warehouses.reduce((a, w) => a + w.capacity, 0);
  const totalUsed = warehouses.reduce((a, w) => a + w.used, 0);
  const operational = warehouses.filter((w) => w.status === 'operational').length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="مواقع التخزين"
        subtitle="إدارة ومتابعة جميع مستودعات ونقاط التخزين"
        action={{ label: 'إضافة مستودع', onClick: () => {}, icon: Plus }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCardAr title="إجمالي المستودعات" value={warehouses.length} icon={MapPin} color="primary" />
        <StatCardAr title="مستودعات تشغيلية" value={operational} icon={CheckCircle} color="success" />
        <StatCardAr title="إجمالي السعة" value={`${(total / 1000).toFixed(0)}k`} icon={Package} color="primary" />
        <StatCardAr
          title="نسبة الإشغال"
          value={`${Math.round((totalUsed / total) * 100)}%`}
          icon={AlertTriangle}
          trend={{ value: totalUsed + ' من ' + total, isPositive: true }}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warehouses.map((wh) => {
          const usagePercent = Math.round((wh.used / wh.capacity) * 100);
          const barColor =
            usagePercent >= 95 ? '#B85C50' : usagePercent >= 80 ? '#C9A961' : '#6A7B4D';

          return (
            <Card key={wh.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="text-right">
                  <CardTitle>{wh.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1 flex-row-reverse justify-end">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{wh.location}</p>
                  </div>
                </div>
                <Badge variant={statusVariants[wh.status]}>{statusLabels[wh.status]}</Badge>
              </CardHeader>
              <CardContent>
                {/* Capacity bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{wh.used.toLocaleString()} / {wh.capacity.toLocaleString()}</span>
                    <span className="font-medium text-foreground">نسبة الإشغال: {usagePercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{ width: `${usagePercent}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-right">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">مدير المستودع</p>
                    <p className="font-medium text-foreground">{wh.manager}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">آخر جرد</p>
                    <p className="font-medium text-foreground">{wh.lastAudit}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs mb-2">فئات المخزون</p>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {wh.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 text-xs bg-[#4B5B3A] bg-opacity-10 text-[#4B5B3A] rounded-lg border border-[#4B5B3A] border-opacity-20"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};


