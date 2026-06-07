import { useParams, useNavigate } from 'react-router';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ArrowRight, CheckCircle, XCircle, Clock, Package, User, Calendar, MessageSquare } from 'lucide-react';

const timeline = [
  { status: 'تم الإنشاء', date: '2026-05-02 09:15', by: 'منسق المطبخ محمد علي', icon: Package, color: 'text-[#4B5B3A]' },
  { status: 'قيد المراجعة', date: '2026-05-02 09:30', by: 'النظام', icon: Clock, color: 'text-[#C9A961]' },
  { status: 'بانتظار موافقة المسؤول', date: '2026-05-03 10:00', by: 'المنظومة الآلية', icon: Clock, color: 'text-[#C9A961]' },
];

const requestItems = [
  { name: 'أرز', quantity: 300, kitchen: 'صندوق', category: 'غذاء' },
  { name: 'مياه معبأة 1.5 لتر', quantity: 1200, kitchen: 'قارورة', category: 'غذاء' },
  { name: 'حليب', quantity: 50, kitchen: 'قنينة', category: 'أغذية' },
];

export const RequestDetailsAr = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const request = {
    id: id || 'REQ-1234',
    kitchen: 'المطبخ المركزي',
    requestedBy: 'منسق المطبخ محمد علي',
    priority: 'high',
    status: 'pending',
    requestedDate: '2026-05-02',
    deliveryDate: '2026-05-10',
    justification: 'وحدتنا في المنطقة الشمالية تواجه نقصاً حاداً في المؤن الأساسية. الاحتياطيات الحالية تكفي لـ 3 أيام فقط. مطلوب الإمداد قبل بدء مرحلة العمليات القادمة.',
  };

  const isAdmin = location.pathname.includes('/ar/admin');

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="mb-2">
        <button
          onClick={() => navigate(isAdmin ? '/ar/admin/requests' : '/ar/user/requests')}
          className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm flex-row-reverse"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى الطلبات
        </button>
      </div>

      <PageHeaderAr
        title={`تفاصيل الطلب ${request.id}`}
        subtitle={`${request.kitchen} • ${request.requestedDate}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={request.status === 'pending' ? 'pending' : 'success'}>
                  {request.status === 'pending' ? 'قيد المراجعة' : 'موافق عليه'}
                </Badge>
                <CardTitle className="text-right">معلومات الطلب</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'رقم الطلب', value: request.id, icon: Package },
                  { label: 'المطبخ', value: request.kitchen, icon: User },
                  { label: 'مقدّم الطلب', value: request.requestedBy, icon: User },
                  { label: 'الأولوية', value: 'عالية', icon: Clock },
                  { label: 'تاريخ الطلب', value: request.requestedDate, icon: Calendar },
                  { label: 'تاريخ التسليم المطلوب', value: request.deliveryDate, icon: Calendar },
                ].map((f) => (
                  <div key={f.label} className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                    <p className="font-medium text-foreground">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-border text-right">
                <p className="text-xs text-muted-foreground mb-2">مبرر الطلب</p>
                <p className="text-foreground text-sm leading-relaxed">{request.justification}</p>
              </div>
            </CardContent>
          </Card>

          {/* Items table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">الأصناف المطلوبة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="border-b border-border">
                    <tr>
                      {['اسم الصنف', 'الفئة', 'الكمية المطلوبة'].map((h) => (
                        <th key={h} className="pb-3 text-sm font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requestItems.map((item, i) => (
                      <tr key={i} className="hover:bg-muted/20">
                        <td className="py-3 font-medium text-foreground">{item.name}</td>
                        <td className="py-3 text-foreground">{item.category}</td>
                        <td className="py-3 font-medium">{item.quantity} {item.kitchen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Admin comment */}
          {isAdmin && request.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center justify-end gap-2">
                  <MessageSquare className="w-5 h-5" />
                  تعليق المراجعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-right resize-none"
                  rows={3}
                  placeholder="أضف تعليقاً على قرار الموافقة أو الرفض..."
                />
                <div className="flex gap-3 mt-4 justify-end">
                  <Button variant="outline" className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white">
                    <XCircle className="w-4 h-4" />
                    رفض الطلب
                  </Button>
                  <Button className="flex items-center gap-2 bg-[#6A7B4D] hover:bg-[#4B5B3A]">
                    <CheckCircle className="w-4 h-4" />
                    الموافقة على الطلب
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: timeline */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">سجل الحالة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-border" />
                {timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 flex-row-reverse relative">
                    <div className={`p-2 bg-card border border-border rounded-full z-10 ${event.color}`}>
                      <event.icon className="w-4 h-4" />
                    </div>
                    <div className="text-right flex-1">
                      <p className="font-medium text-foreground text-sm">{event.status}</p>
                      <p className="text-xs text-muted-foreground">{event.by}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              {!isAdmin && request.status === 'pending' && (
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-white">
                  إلغاء الطلب
                </Button>
              )}
              <Button variant="outline" className="w-full">
                طباعة الطلب
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


