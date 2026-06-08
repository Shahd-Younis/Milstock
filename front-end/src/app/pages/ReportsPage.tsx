import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertCircle, Download, FileText } from 'lucide-react';
import { StatCard } from '../components/StatCard';

const consumptionData = [
  { month: 'Dec', food: 1200, medical: 450, equipment: 320, supplies: 280 },
  { month: 'Jan', food: 1350, medical: 520, equipment: 380, supplies: 310 },
  { month: 'Feb', food: 1180, medical: 480, equipment: 350, supplies: 290 },
  { month: 'Mar', food: 1420, medical: 550, equipment: 410, supplies: 340 },
  { month: 'Apr', food: 1280, medical: 510, equipment: 370, supplies: 300 },
  { month: 'May', food: 1390, medical: 540, equipment: 395, supplies: 325 },
];

const wasteData = [
  { month: 'Dec', expired: 45, damaged: 12 },
  { month: 'Jan', expired: 38, damaged: 8 },
  { month: 'Feb', expired: 52, damaged: 15 },
  { month: 'Mar', expired: 41, damaged: 9 },
  { month: 'Apr', expired: 36, damaged: 11 },
  { month: 'May', expired: 29, damaged: 7 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#4E4631]/15 rounded-xl p-3 shadow-md text-xs">
        <p className="font-semibold text-[#2E3A24] mb-1.5">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}: <span className="font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ReportsPage = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Insights and trends for inventory management"
      />

      {/* Export actions */}
      <div className="flex items-center gap-3 -mt-4">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Export Excel
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCard title="Avg Monthly Consumption" value="3,450" icon={Package} trend={{ value: '+8% vs last quarter', isPositive: true }} color="primary" />
        <StatCard title="Waste Reduction" value="15%" icon={TrendingDown} trend={{ value: 'Since last month', isPositive: true }} color="success" />
        <StatCard title="Supply Efficiency" value="94.2%" icon={TrendingUp} trend={{ value: '+2.1% improvement', isPositive: true }} color="primary" />
        <StatCard title="Critical Shortages" value="3" icon={AlertCircle} trend={{ value: '-2 from last week', isPositive: true }} color="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Consumption Trends by Category</CardTitle>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={consumptionData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} barSize={8} barGap={2}>
                <CartesianGrid key="rpt-bc-grid" strokeDasharray="3 3" stroke="#4E4631" opacity={0.07} vertical={false} />
                <XAxis key="rpt-bc-xaxis" dataKey="month" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} />
                <YAxis key="rpt-bc-yaxis" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip key="rpt-bc-tooltip" content={<CustomTooltip />} />
                <Legend key="rpt-bc-legend" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#5A6B50' }} />
                <Bar key="rpt-bc-food" dataKey="food" fill="#4B5B3A" name="Food" radius={[3, 3, 0, 0]} />
                <Bar key="rpt-bc-medical" dataKey="medical" fill="#6A7B4D" name="Dairy" radius={[3, 3, 0, 0]} />
                <Bar key="rpt-bc-equipment" dataKey="equipment" fill="#8A9B6D" name="Bakery" radius={[3, 3, 0, 0]} />
                <Bar key="rpt-bc-supplies" dataKey="supplies" fill="#C9A961" name="Pantry" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Analysis</CardTitle>
            <span className="text-xs text-muted-foreground">Expired vs Damaged</span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={wasteData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid key="rpt-lc-grid" strokeDasharray="3 3" stroke="#4E4631" opacity={0.07} />
                <XAxis key="rpt-lc-xaxis" dataKey="month" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} />
                <YAxis key="rpt-lc-yaxis" stroke="#5A6B50" tick={{ fontSize: 11, fill: '#5A6B50' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip key="rpt-lc-tooltip" content={<CustomTooltip />} />
                <Legend key="rpt-lc-legend" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#5A6B50' }} />
                <Line key="rpt-lc-expired" type="monotone" dataKey="expired" stroke="#D4183D" strokeWidth={2.5} name="Expired Items" dot={false} activeDot={{ r: 4 }} />
                <Line key="rpt-lc-damaged" type="monotone" dataKey="damaged" stroke="#C9A961" strokeWidth={2.5} name="Damaged Items" dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#5B8A4A]/8 rounded-xl border border-[#5B8A4A]/15">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#5B8A4A]/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#5B8A4A]" />
                </div>
                <h4 className="font-semibold text-[#2E3A24]">Improved Efficiency</h4>
              </div>
              <p className="text-sm text-[#5A6B50] leading-relaxed">
                Supply efficiency has improved by 2.1% this month due to better expiration monitoring and reduced waste.
              </p>
            </div>
            <div className="p-5 bg-[#B8862A]/8 rounded-xl border border-[#B8862A]/15">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#B8862A]/15 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#B8862A]" />
                </div>
                <h4 className="font-semibold text-[#2E3A24]">Seasonal Trends</h4>
              </div>
              <p className="text-sm text-[#5A6B50] leading-relaxed">
                Food consumption peaks in March and May, suggesting seasonal operational patterns that require planning.
              </p>
            </div>
            <div className="p-5 bg-[#4B5B3A]/8 rounded-xl border border-[#4B5B3A]/15">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#4B5B3A]/15 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-[#4B5B3A]" />
                </div>
                <h4 className="font-semibold text-[#2E3A24]">Waste Reduction</h4>
              </div>
              <p className="text-sm text-[#5A6B50] leading-relaxed">
                Expired items decreased by 24% compared to February, showing effectiveness of the new alert system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};