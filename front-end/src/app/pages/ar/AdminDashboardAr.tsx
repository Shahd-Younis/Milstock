import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { StatCardAr } from '../../components/ar/StatCardAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Package, AlertTriangle, Calendar, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Link } from 'react-router';
import { Button } from '../../components/Button';

const stockTrendData = [
  { month: 'يناير', stock: 2400, requests: 240 },
  { month: 'فبراير', stock: 2210, requests: 198 },
  { month: 'مارس', stock: 2290, requests: 280 },
  { month: 'أبريل', stock: 2000, requests: 308 },
  { month: 'مايو', stock: 2181, requests: 189 },
];

const categoryData = [
  { name: 'غذاء', value: 4500 },
  { name: 'ألبان', value: 2800 },
  { name: 'مخبوزات', value: 3200 },
  { name: 'أغذية', value: 2100 },
];

const COLORS = ['#4B5B3A', '#6A7B4D', '#8A9B6D', '#C9A961'];

const recentRequests = [
  { id: 'REQ-1234', kitchen: 'المطبخ المركزي', item: 'أرز', quantity: 500, status: 'pending', priority: 'high', time: 'منذ 10 دقائق' },
  { id: 'REQ-1233', kitchen: 'مطبخ المخبوزات', item: 'أغذية ألبانة', quantity: 200, status: 'approved', priority: 'urgent', time: 'منذ ساعة' },
  { id: 'REQ-1232', kitchen: 'مطبخ الخضروات', item: 'قوارير مياه', quantity: 1000, status: 'delivered', priority: 'normal', time: 'منذ 3 ساعات' },
];

const criticalAlerts = [
  { type: 'low-stock', message: 'الأغذية الألبانة دون الحد المسموح به في المستودع B', severity: 'danger', time: 'منذ 5 دقائق' },
  { type: 'expiring', message: '50 صنفاً تنتهي صلاحيتها خلال 7 أيام', severity: 'warning', time: 'منذ 15 دقيقة' },
  { type: 'info', message: 'اكتمل التدقيق الشهري للمخزون بنجاح', severity: 'success', time: 'منذ ساعتين' },
];

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  approved: 'موافق عليه',
  delivered: 'تم التسليم',
};

const priorityLabels: Record<string, string> = {
  urgent: 'عاجل',
  high: 'عالية',
  normal: 'عادية',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#4E4631]/15 rounded-xl p-3 shadow-md text-xs text-right" dir="rtl">
        <p className="font-semibold text-[#2E3A24] mb-1.5">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="flex items-center gap-1.5 flex-row-reverse" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}: <span className="font-medium">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminDashboardAr = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCardAr title="إجمالي أصناف المخزون" value="12,458" icon={Package} trend={{ value: '+12% عن الشهر الماضي', isPositive: true }} color="primary" />
        <StatCardAr title="أصناف منخفضة المخزون" value="23" icon={AlertTriangle} trend={{ value: '+5 منذ أمس', isPositive: false }} color="warning" />
        <StatCardAr title="تنتهي صلاحيتها قريباً" value="47" icon={Calendar} trend={{ value: 'خلال 30 يوماً', isPositive: false }} color="danger" />
        <StatCardAr title="الطلبات المعلّقة" value="12" icon={FileText} trend={{ value: '-3 عن أمس', isPositive: true }} color="success" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Line chart — wider */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <span className="text-xs text-muted-foreground">آخر 5 أشهر</span>
            <CardTitle className="text-right">اتجاهات المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stockTrendData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid key="ar-adm-lc-grid" strokeDasharray="3 3" stroke="#4E4631" opacity={0.07} />
                <XAxis key="ar-adm-lc-xaxis" dataKey="month" stroke="#5A6B50" tick={{ fontSize: 12, fill: '#5A6B50' }} axisLine={false} tickLine={false} />
                <YAxis key="ar-adm-lc-yaxis" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip key="ar-adm-lc-tooltip" content={<CustomTooltip />} />
                <Legend key="ar-adm-lc-legend" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#5A6B50' }} />
                <Line key="ar-adm-lc-stock" type="monotone" dataKey="stock" stroke="#4B5B3A" strokeWidth={2.5} name="مستوى المخزون" dot={false} activeDot={{ r: 4 }} />
                <Line key="ar-adm-lc-requests" type="monotone" dataKey="requests" stroke="#6A7B4D" strokeWidth={2.5} name="الطلبات" dot={false} activeDot={{ r: 4 }} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">المخزون حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie key="ar-adm-pc-pie" data={categoryData} cx="50%" cy="45%" outerRadius={85} innerRadius={45} dataKey="value" labelLine={false}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip key="ar-adm-pc-tooltip" formatter={(v: any) => [v.toLocaleString(), 'وحدة']} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid rgba(78,70,49,0.15)' }} />
                <Legend key="ar-adm-pc-legend" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#5A6B50' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <Link to="/ar/admin/requests">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                عرض الكل
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <CardTitle className="text-right">أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start justify-between p-4 rounded-xl bg-[#ECEEE2]/60 hover:bg-[#ECEEE2] border border-transparent hover:border-[#4E4631]/10 transition-all"
                >
                  <div className="flex flex-col items-end gap-2 mr-3 flex-shrink-0">
                    <Badge
                      variant={req.status === 'pending' ? 'pending' : req.status === 'approved' ? 'success' : 'info'}
                    >
                      {statusLabels[req.status]}
                    </Badge>
                    <span className="text-[11px] text-[#5A6B50]">{req.time}</span>
                  </div>
                  <div className="text-right min-w-0 flex-1">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span
                        className={
                          req.priority === 'urgent'
                            ? 'text-[10px] font-bold text-[#C0392B] uppercase tracking-wide'
                            : req.priority === 'high'
                            ? 'text-[10px] font-bold text-[#B8862A] uppercase tracking-wide'
                            : 'text-[10px] text-[#5A6B50] uppercase tracking-wide'
                        }
                      >
                        {priorityLabels[req.priority]}
                      </span>
                      <span className="text-sm font-semibold text-[#2E3A24]">{req.id}</span>
                    </div>
                    <p className="text-xs text-[#5A6B50] mb-1">{req.kitchen}</p>
                    <p className="text-sm text-[#2E3A24]">
                      {req.item} <span className="text-[#5A6B50]">× {req.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <span className="text-xs bg-[#C0392B]/10 text-[#C0392B] px-2 py-0.5 rounded-lg font-medium">
              2 نشط
            </span>
            <CardTitle className="text-right">التنبيهات الحرجة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl border flex-row-reverse ${
                    alert.severity === 'danger'
                      ? 'bg-[#C0392B]/5 border-[#C0392B]/15'
                      : alert.severity === 'warning'
                      ? 'bg-[#B8862A]/5 border-[#B8862A]/15'
                      : 'bg-[#5B8A4A]/5 border-[#5B8A4A]/15'
                  }`}
                >
                  <div
                    className={`w-1.5 flex-shrink-0 rounded-full mt-0.5 self-stretch ${
                      alert.severity === 'danger'
                        ? 'bg-[#C0392B]'
                        : alert.severity === 'warning'
                        ? 'bg-[#B8862A]'
                        : 'bg-[#5B8A4A]'
                    }`}
                  />
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-sm text-[#2E3A24] font-medium leading-snug mb-1">{alert.message}</p>
                    <p className="text-xs text-[#5A6B50]">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


