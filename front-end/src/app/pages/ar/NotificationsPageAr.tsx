import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Bell, AlertTriangle, CheckCircle, Info, Package, FileText, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  category: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  { id: '1', title: 'تنبيه انخفاض المخزون', message: 'مستوى الأغذية الألبانة في المستودع B أصبح دون الحد الأدنى المسموح به (150 وحدة)', type: 'alert', category: 'المخزون', time: 'منذ 5 دقائق', read: false },
  { id: '2', title: 'طلب جديد بانتظار الموافقة', message: 'مطبخ المخبوزات أرسلت طلب توريد REQ-1234 بأولوية عاجلة', type: 'warning', category: 'الطلبات', time: 'منذ 15 دقيقة', read: false },
  { id: '3', title: 'تمت الموافقة على الطلب', message: 'تمت الموافقة على طلبك REQ-1233 وجارٍ تجهيز الإمداد', type: 'success', category: 'الطلبات', time: 'منذ ساعة', read: false },
  { id: '4', title: 'اقتراب تاريخ انتهاء الصلاحية', message: '50 صنفاً ستنتهي صلاحيتها خلال 7 أيام — يرجى المراجعة الفورية', type: 'warning', category: 'الصلاحية', time: 'منذ 2 ساعة', read: true },
  { id: '5', title: 'اكتمال الجرد الشهري', message: 'تم إنجاز التدقيق الشهري للمخزون بنجاح تام دون أي تباين', type: 'success', category: 'النظام', time: 'منذ 3 ساعات', read: true },
  { id: '6', title: 'تسليم ناجح', message: 'تم تسليم الطلب REQ-1232 إلى مطبخ الخضروات بنجاح', type: 'info', category: 'الطلبات', time: 'أمس', read: true },
  { id: '7', title: 'تحديث بيانات المستخدم', message: 'تم تحديث صلاحيات الوصول للملازم خالد', type: 'info', category: 'النظام', time: 'أمس', read: true },
];

const typeConfig: Record<string, { icon: any; variant: any; color: string }> = {
  alert: { icon: AlertTriangle, variant: 'danger', color: 'text-destructive bg-destructive bg-opacity-10' },
  warning: { icon: AlertTriangle, variant: 'warning', color: 'text-[#C9A961] bg-[#C9A961] bg-opacity-10' },
  success: { icon: CheckCircle, variant: 'success', color: 'text-[#6A7B4D] bg-[#6A7B4D] bg-opacity-10' },
  info: { icon: Info, variant: 'info', color: 'text-[#4B5B3A] bg-[#4B5B3A] bg-opacity-10' },
};

const categoryLabels: Record<string, string> = {
  'all': 'الكل',
  'المخزون': 'المخزون',
  'الطلبات': 'الطلبات',
  'الصلاحية': 'الصلاحية',
  'النظام': 'النظام',
};

export const NotificationsPageAr = () => {
  const [filter, setFilter] = useState('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
  const [notifs, setNotifs] = useState(notifications);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  const filtered = notifs.filter((n) => {
    const matchCat = filter === 'all' || n.category === filter;
    const matchRead = readFilter === 'all' || !n.read;
    return matchCat && matchRead;
  });

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="الإشعارات"
        subtitle={`${unreadCount} إشعار غير مقروء`}
      />

      {/* Filters — RTL: action button on right, toggle filters on left */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 justify-end">
          {['all', 'unread'].map((r) => (
            <button
              key={r}
              onClick={() => setReadFilter(r as any)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                readFilter === r
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {r === 'all' ? 'جميع الإشعارات' : 'غير المقروءة'}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          تعليم الكل كمقروء
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-end">
        {Object.keys(categoryLabels).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
              filter === cat
                ? 'bg-[#4B5B3A] text-white'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground">لا توجد إشعارات</p>
          </div>
        )}
        {filtered.map((notif) => {
          const config = typeConfig[notif.type];
          const Icon = config.icon;
          return (
            <Card
              key={notif.id}
              className={`transition-all ${!notif.read ? 'border-primary border-opacity-30 bg-primary bg-opacity-5' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-start justify-between mb-1 flex-row-reverse">
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <span className="w-2 h-2 bg-[#B85C50] rounded-full flex-shrink-0" />
                        )}
                        <p className="font-semibold text-foreground">{notif.title}</p>
                      </div>
                      <button
                        onClick={() => dismiss(notif.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                      <span className="text-xs text-muted-foreground">{notif.time}</span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-lg text-muted-foreground">{notif.category}</span>
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


