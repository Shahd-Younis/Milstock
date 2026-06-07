import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { User, Mail, Phone, Shield, Camera, Save, Lock, Eye, EyeOff, Bell } from 'lucide-react';

export const ProfilePageAr = () => {
  const [editing, setEditing] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [form, setForm] = useState({
    name: 'مدير المخزون يوسف الراشد',
    email: 'yousuf@milstock.local',
    phone: '+966 50 123 4567',
    kitchen: 'إدارة المخزون',
    rank: 'مقدم',
    employeeId: 'MIL-10042',
  });

  const recentActivity = [
    { action: 'تسجيل دخول', time: '2026-05-05 08:32', ip: '192.168.1.10' },
    { action: 'الموافقة على طلب REQ-1233', time: '2026-05-05 10:01', ip: '192.168.1.10' },
    { action: 'تصدير تقرير شهري', time: '2026-05-04 16:45', ip: '192.168.1.10' },
    { action: 'تغيير إعدادات الأمان', time: '2026-05-03 11:00', ip: '192.168.1.10' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="الملف الشخصي"
        subtitle="إدارة معلوماتك الشخصية وإعدادات الحساب"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-[#4B5B3A] rounded-2xl flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute -bottom-2 -left-2 p-2 bg-white border border-border rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Camera className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{form.name}</h2>
            <p className="text-muted-foreground mb-3">{form.rank}</p>
            <Badge variant="danger" className="mb-4">مسؤول النظام</Badge>

            <div className="space-y-3 text-sm text-right mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 flex-row-reverse justify-between">
                <span className="text-muted-foreground">الوحدة</span>
                <span className="font-medium text-foreground">{form.kitchen}</span>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse justify-between">
                <span className="text-muted-foreground">رقم الموظف</span>
                <span className="font-medium text-foreground">{form.employeeId}</span>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse justify-between">
                <span className="text-muted-foreground">حالة الحساب</span>
                <Badge variant="success">نشط</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <Button
                variant={editing ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'إلغاء' : 'تعديل'}
              </Button>
              <CardTitle className="text-right">المعلومات الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'الاسم الكامل', key: 'name', icon: User },
                  { label: 'البريد الإلكتروني', key: 'email', icon: Mail },
                  { label: 'رقم الهاتف', key: 'phone', icon: Phone },
                  { label: 'المطبخ', key: 'kitchen', icon: Shield },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-foreground mb-2 text-right">{field.label}</label>
                    {editing ? (
                      <Input
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="text-right"
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-row-reverse px-4 py-3 bg-muted/30 rounded-xl">
                        <field.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground flex-1 text-right">{form[field.key as keyof typeof form]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {editing && (
                <Button onClick={() => setEditing(false)} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Change password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center justify-end gap-2">
                <Lock className="w-5 h-5" />
                تغيير كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 text-right">كلمة المرور الحالية</label>
                <div className="relative">
                  <Input type={showCurrentPass ? 'text' : 'password'} placeholder="••••••••" className="text-right pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 text-right">كلمة المرور الجديدة</label>
                <div className="relative">
                  <Input type={showNewPass ? 'text' : 'password'} placeholder="••••••••" className="text-right pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 text-right">تأكيد كلمة المرور الجديدة</label>
                <Input type="password" placeholder="••••••••" className="text-right" />
              </div>
              <Button className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                تحديث كلمة المرور
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center justify-end gap-2">
                <Bell className="w-5 h-5" />
                تفضيلات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'تنبيهات المخزون المنخفض', desc: 'تلقّي إشعارات عند نفاد المواد', defaultChecked: true },
                  { label: 'تحذيرات انتهاء الصلاحية', desc: 'تنبيه بالمواد المقاربة لتاريخ انتهاء صلاحيتها', defaultChecked: true },
                  { label: 'تحديثات الطلبات', desc: 'متابعة حالة طلبات التموين الخاصة بك', defaultChecked: true },
                  { label: 'التقارير الأسبوعية', desc: 'استلام ملخص أسبوعي للمخزون عبر البريد الإلكتروني', defaultChecked: false },
                ].map((item) => (
                  <label key={item.label} className="flex items-start gap-3 cursor-pointer flex-row-reverse">
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 accent-primary mt-0.5" />
                    <div className="text-right">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-6">
                <Button className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  حفظ التفضيلات
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                    <span className="text-xs text-muted-foreground font-mono">{a.ip}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


