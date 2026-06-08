import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { AlertTriangle, Bell, Save } from "lucide-react";
const SettingsPageAr = () => {
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
    title="إعدادات النظام"
    subtitle="تخصيص وضبط التفضيلات وحدود التنبيه على مستوى المنظومة"
  />

      <div className="max-w-4xl space-y-5">
        {
    /* Alert Thresholds */
  }
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5 flex-row-reverse justify-end">
              <CardTitle className="text-right">حدود التنبيه</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-[#6A7B4D]/12 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#6A7B4D]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 text-right">
                    حد المخزون المنخفض (%)
                  </label>
                  <Input type="number" defaultValue="20" min="0" max="100" className="text-right" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 text-right">
                    حد المخزون الحرج (%)
                  </label>
                  <Input type="number" defaultValue="10" min="0" max="100" className="text-right" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 text-right">
                    إشعار الصلاحية المبكر (أيام)
                  </label>
                  <Input type="number" defaultValue="30" min="1" className="text-right" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 text-right">
                    تنبيه انتهاء الصلاحية الحرج (أيام)
                  </label>
                  <Input type="number" defaultValue="7" min="1" className="text-right" />
                </div>
              </div>
              <Button className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                حفظ إعدادات الحدود
              </Button>
            </div>
          </CardContent>
        </Card>

        {
    /* Notification Settings */
  }
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5 flex-row-reverse justify-end">
              <CardTitle className="text-right">إعدادات الإشعارات</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-[#6A7B4D]/12 flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#6A7B4D]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
    { label: "\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A", desc: "\u0625\u0631\u0633\u0627\u0644 \u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F \u0644\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u062D\u0631\u062C\u0629", defaultChecked: true },
    { label: "\u062A\u0646\u0628\u064A\u0647\u0627\u062A SMS", desc: "\u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0626\u0644 \u0646\u0635\u064A\u0629 \u0644\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u062C\u0644\u0629", defaultChecked: true },
    { label: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u064A\u0648\u0645\u064A\u0629", desc: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0644\u062E\u0635\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0627\u0644\u064A\u0648\u0645\u064A\u0629", defaultChecked: false }
  ].map((item) => <label key={item.label} className="flex items-center justify-between cursor-pointer">
                  <input type="checkbox" defaultChecked={item.defaultChecked} className="w-5 h-5 accent-primary" />
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </label>)}
            </div>
            <div className="mt-6">
              <Button className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                حفظ إعدادات الإشعارات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export {
  SettingsPageAr
};
