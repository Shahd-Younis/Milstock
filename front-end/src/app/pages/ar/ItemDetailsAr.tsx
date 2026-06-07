import { useParams, useNavigate } from 'react-router';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ArrowRight, Edit, Trash2, Package, MapPin, Calendar, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const movementHistory = [
  { month: 'يناير', in: 500, out: 320 },
  { month: 'فبراير', in: 300, out: 280 },
  { month: 'مارس', in: 600, out: 400 },
  { month: 'أبريل', in: 200, out: 350 },
  { month: 'مايو', in: 400, out: 310 },
];

export const ItemDetailsAr = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = {
    id: id || 'INV-001',
    name: 'أرز',
    category: 'غذاء',
    quantity: 2500,
    kitchen: 'صندوق',
    minStock: 500,
    maxStock: 5000,
    expirationDate: '2027-12-31',
    warehouse: 'المستودع A',
    location: 'القسم B، الرف 3',
    status: 'in-stock' as const,
    supplier: 'الموردون العسكريون الموحدون',
    lastUpdated: '2026-05-01',
    description: 'حصص غذائية عسكرية جاهزة للأكل صالحة للمناطق البعيدة والعمليات الميدانية.',
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="mb-2 flex items-center justify-end">
        <button
          onClick={() => navigate('/ar/admin/inventory')}
          className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى المخزون
        </button>
      </div>

      <PageHeaderAr
        title={item.name}
        subtitle={`${item.id} • ${item.category}`}
        action={{ label: 'تعديل الصنف', onClick: () => navigate(`/ar/admin/inventory/${id}/edit`), icon: Edit }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-right">تفاصيل الصنف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'رمز الصنف', value: item.id, icon: Package },
                { label: 'الفئة', value: item.category, icon: Package },
                { label: 'الكمية الحالية', value: `${item.quantity} ${item.kitchen}`, icon: Package },
                { label: 'الحد الأدنى للمخزون', value: `${item.minStock} ${item.kitchen}`, icon: TrendingDown },
                { label: 'تاريخ الصلاحية', value: item.expirationDate, icon: Calendar },
                { label: 'المستودع', value: item.warehouse, icon: MapPin },
                { label: 'الموقع', value: item.location, icon: MapPin },
                { label: 'آخر تحديث', value: item.lastUpdated, icon: Calendar },
              ].map((field) => (
                <div key={field.label} className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                  <p className="font-medium text-foreground">{field.value}</p>
                </div>
              ))}
            </div>
            {item.description && (
              <div className="mt-6 pt-6 border-t border-border text-right">
                <p className="text-xs text-muted-foreground mb-2">الوصف</p>
                <p className="text-foreground">{item.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status card */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-[#4B5B3A] bg-opacity-10 rounded-2xl inline-block">
                  <Package className="w-10 h-10 text-[#4B5B3A]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{item.quantity}</p>
                  <p className="text-muted-foreground">{item.kitchen} متوفرة</p>
                </div>
                <Badge variant="success">متوفر</Badge>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-[#4B5B3A] h-2 rounded-full"
                    style={{ width: `${(item.quantity / item.maxStock) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((item.quantity / item.maxStock) * 100)}% من السعة القصوى
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full flex items-center justify-center gap-2" size="sm">
                <Edit className="w-4 h-4" />
                تعديل الصنف
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white" size="sm">
                <Trash2 className="w-4 h-4" />
                حذف الصنف
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-right">
              <div className="flex items-start gap-3 flex-row-reverse">
                <AlertTriangle className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">حد إعادة الطلب</p>
                  <p className="text-xs text-muted-foreground">
                    سيتم إصدار تنبيه تلقائي عند وصول المخزون إلى {item.minStock} {item.kitchen}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Movement chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">سجل الحركة (آخر 5 أشهر)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movementHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4E4631" opacity={0.1} />
              <XAxis dataKey="month" stroke="#4E4631" />
              <YAxis stroke="#4E4631" />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #4E4631', borderRadius: '8px' }}
              />
              <Bar dataKey="in" fill="#6A7B4D" name="وارد" />
              <Bar dataKey="out" fill="#B85C50" name="صادر" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};


