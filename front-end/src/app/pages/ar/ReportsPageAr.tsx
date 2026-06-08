import { StatCardAr } from '../../components/ar/StatCardAr';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertCircle, Download, FileText } from 'lucide-react';

const consumptionData = [
  { month: 'ديسمبر', food: 1200, medical: 450, equipment: 320, supplies: 280 },
  { month: 'يناير', food: 1350, medical: 520, equipment: 380, supplies: 310 },
  { month: 'فبراير', food: 1180, medical: 480, equipment: 350, supplies: 290 },
  { month: 'مارس', food: 1420, medical: 550, equipment: 410, supplies: 340 },
  { month: 'أبريل', food: 1280, medical: 510, equipment: 370, supplies: 300 },
  { month: 'مايو', food: 1390, medical: 540, equipment: 395, supplies: 325 },
];

const wasteData = [
  { month: 'ديسمبر', expired: 45, damaged: 12 },
  { month: 'يناير', expired: 38, damaged: 8 },
  { month: 'فبراير', expired: 52, damaged: 15 },
  { month: 'مارس', expired: 41, damaged: 9 },
  { month: 'أبريل', expired: 36, damaged: 11 },
  { month: 'مايو', expired: 29, damaged: 7 },
];


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#4E4631]/15 rounded-xl p-3 shadow-md text-xs text-right" dir="rtl">
        <p className="font-semibold text-[#2E3A24] mb-1.5">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="flex items-center gap-1.5 flex-row-reverse" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}: <span className="font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ReportsPageAr = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeaderAr
        title="التقارير والتحليلات"
        subtitle="رؤى واتجاهات لإدارة المخزون"
      />

      {/* Export actions */}
      <div className="flex items-center gap-3 -mt-4">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          تصدير PDF
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          تصدير Excel
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCardAr title="متوسط الاستهلاك الشهري" value="3,450" icon={Package} trend={{ value: '+8% عن الربع السابق', isPositive: true }} color="primary" />
        <StatCardAr title="تقليص الهدر" value="15%" icon={TrendingDown} trend={{ value: 'منذ الشهر الماضي', isPositive: true }} color="success" />
        <StatCardAr title="كفاءة التوريد" value="94.2%" icon={TrendingUp} trend={{ value: '+2.1% تحسّن', isPositive: true }} color="primary" />
        <StatCardAr title="نقص حرج" value="3" icon={AlertCircle} trend={{ value: '-2 عن الأسبوع الماضي', isPositive: true }} color="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">اتجاهات الاستهلاك حسب الفئة</CardTitle>
            <span className="text-xs text-muted-foreground">آخر 6 أشهر</span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={consumptionData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} barSize={8} barGap={2}>
                <CartesianGrid key="ar-rpt-bc-grid" strokeDasharray="3 3" stroke="#4E4631" opacity={0.07} vertical={false} />
                <XAxis key="ar-rpt-bc-xaxis" dataKey="month" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} />
                <YAxis key="ar-rpt-bc-yaxis" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip key="ar-rpt-bc-tooltip" content={<CustomTooltip />} />
                <Legend key="ar-rpt-bc-legend" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#5A6B50' }} />
                <Bar key="ar-rpt-bc-food" dataKey="food" fill="#4B5B3A" name="غذاء" radius={[3, 3, 0, 0]} />
                <Bar key="ar-rpt-bc-medical" dataKey="medical" fill="#6A7B4D" name="طبي" radius={[3, 3, 0, 0]} />
                <Bar key="ar-rpt-bc-equipment" dataKey="equipment" fill="#8A9B6D" name="معدات" radius={[3, 3, 0, 0]} />
                <Bar key="ar-rpt-bc-supplies" dataKey="supplies" fill="#C9A961" name="مستلزمات" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">تحليل الهدر</CardTitle>
            <span className="text-xs text-muted-foreground">منتهي الصلاحية مقابل التالف</span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={wasteData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid key="ar-rpt-lc-grid" strokeDasharray="3 3" stroke="#4E4631" opacity={0.07} />
                <XAxis key="ar-rpt-lc-xaxis" dataKey="month" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} />
                <YAxis key="ar-rpt-lc-yaxis" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip key="ar-rpt-lc-tooltip" content={<CustomTooltip />} />
                <Legend key="ar-rpt-lc-legend" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#5A6B50' }} />
                <Line key="ar-rpt-lc-expired" type="monotone" dataKey="expired" stroke="#D4183D" strokeWidth={2.5} name="منتهي الصلاحية" dot={false} activeDot={{ r: 4 }} />
                <Line key="ar-rpt-lc-damaged" type="monotone" dataKey="damaged" stroke="#C9A961" strokeWidth={2.5} name="تالف" dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">الرؤى والتوصيات الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#5B8A4A]/8 rounded-xl border border-[#5B8A4A]/15 text-right">
              <div className="flex items-center gap-2 justify-end mb-3">
                <h4 className="font-semibold text-[#2E3A24]">تحسّن الكفاءة</h4>
                <div className="w-8 h-8 rounded-lg bg-[#5B8A4A]/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#5B8A4A]" />
                </div>
              </div>
              <p className="text-sm text-[#5A6B50] leading-relaxed">
                تحسّنت كفاءة التوريد بنسبة 2.1% هذا الشهر بفضل تحسين مراقبة تواريخ الصلاحية وتقليص الهدر.
              </p>
            </div>
            <div className="p-5 bg-[#B8862A]/8 rounded-xl border border-[#B8862A]/15 text-right">
              <div className="flex items-center gap-2 justify-end mb-3">
                <h4 className="font-semibold text-[#2E3A24]">اتجاهات موسمية</h4>
                <div className="w-8 h-8 rounded-lg bg-[#B8862A]/15 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#B8862A]" />
                </div>
              </div>
              <p className="text-sm text-[#5A6B50] leading-relaxed">
                يرتفع استهلاك الغذاء في مارس ومايو بشكل ملحوظ، مما يستدعي التخطيط المسبق لهذه الفترات.
              </p>
            </div>
            <div className="p-5 bg-[#4B5B3A]/8 rounded-xl border border-[#4B5B3A]/15 text-right">
              <div className="flex items-center gap-2 justify-end mb-3">
                <h4 className="font-semibold text-[#2E3A24]">تراجع الهدر</h4>
                <div className="w-8 h-8 rounded-lg bg-[#4B5B3A]/15 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-[#4B5B3A]" />
                </div>
              </div>
              <p className="text-sm text-[#5A6B50] leading-relaxed">
                انخفضت الأصناف منتهية الصلاحية بنسبة 24% مقارنة بفبراير، دلالة على فاعلية نظام التنبيه.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};