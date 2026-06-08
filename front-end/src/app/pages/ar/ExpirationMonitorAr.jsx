import { useState } from "react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { StatCardAr } from "../../components/ar/StatCardAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { AlertTriangle, Calendar, Package, Search, Bell } from "lucide-react";
const expiringItems = [
  { id: "INV-003", name: "\u0632\u062C\u0627\u062C\u0627\u062A \u0645\u064A\u0627\u0647", quantity: 5e3, kitchen: "\u0642\u0631\u0635", expirationDate: "2026-06-01", daysLeft: 27, warehouse: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A", category: "\u0623\u063A\u0630\u064A\u0629" },
  { id: "INV-007", name: "\u0639\u062F\u0633", quantity: 300, kitchen: "\u0639\u0644\u0628\u0629", expirationDate: "2026-06-10", daysLeft: 36, warehouse: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 B", category: "\u0623\u0644\u0628\u0627\u0646" },
  { id: "INV-008", name: "\u0648\u062C\u0628\u0627\u062A \u0637\u0648\u0627\u0631\u0626 \u062E\u0641\u064A\u0641\u0629", quantity: 800, kitchen: "\u0639\u0644\u0628\u0629", expirationDate: "2026-07-15", daysLeft: 71, warehouse: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 C", category: "\u063A\u0630\u0627\u0621" },
  { id: "INV-009", name: "\u0632\u064A\u062A \u0637\u0628\u062E", quantity: 120, kitchen: "\u062D\u0642\u064A\u0628\u0629", expirationDate: "2026-05-25", daysLeft: 20, warehouse: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 B", category: "\u0623\u0644\u0628\u0627\u0646" },
  { id: "INV-010", name: "\u0633\u0643\u0631", quantity: 450, kitchen: "\u0642\u0646\u064A\u0646\u0629", expirationDate: "2026-08-30", daysLeft: 117, warehouse: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A", category: "\u0623\u0644\u0628\u0627\u0646" }
];
const getUrgencyBadge = (days) => {
  if (days <= 30) return <Badge variant="danger">حرج ({days} يوم)</Badge>;
  if (days <= 60) return <Badge variant="warning">تحذير ({days} يوم)</Badge>;
  return <Badge variant="info">مراقبة ({days} يوم)</Badge>;
};
const ExpirationMonitorAr = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const filtered = expiringItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (urgencyFilter === "critical") return matchSearch && item.daysLeft <= 30;
    if (urgencyFilter === "warning") return matchSearch && item.daysLeft > 30 && item.daysLeft <= 60;
    if (urgencyFilter === "monitor") return matchSearch && item.daysLeft > 60;
    return matchSearch;
  });
  const critical = expiringItems.filter((i) => i.daysLeft <= 30).length;
  const warning = expiringItems.filter((i) => i.daysLeft > 30 && i.daysLeft <= 60).length;
  const monitor = expiringItems.filter((i) => i.daysLeft > 60).length;
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
    title="متابعة تواريخ الصلاحية"
    subtitle="مراقبة الأصناف القريبة من انتهاء الصلاحية والتنبيه المبكر"
  />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCardAr title="أصناف حرجة (≤30 يوم)" value={critical} icon={AlertTriangle} color="danger" />
        <StatCardAr title="تحذير (31-60 يوم)" value={warning} icon={Calendar} color="warning" />
        <StatCardAr title="قيد المراقبة" value={monitor} icon={Bell} color="primary" />
        <StatCardAr title="إجمالي تحت المراقبة" value={expiringItems.length} icon={Package} color="success" />
      </div>

      {
    /* Filters */
  }
      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
    placeholder="ابحث باسم الصنف..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pr-12 text-right"
  />
          </div>
          <Select
    options={[
      { value: "all", label: "\u062C\u0645\u064A\u0639 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0625\u0644\u062D\u0627\u062D" },
      { value: "critical", label: "\u062D\u0631\u062C (\u226430 \u064A\u0648\u0645)" },
      { value: "warning", label: "\u062A\u062D\u0630\u064A\u0631 (31-60 \u064A\u0648\u0645)" },
      { value: "monitor", label: "\u0645\u0631\u0627\u0642\u0628\u0629 (>60 \u064A\u0648\u0645)" }
    ]}
    value={urgencyFilter}
    onChange={(e) => setUrgencyFilter(e.target.value)}
  />
        </div>
      </div>

      {
    /* Timeline card — critical items */
  }
      {critical > 0 && <Card className="mb-6 border-destructive border-opacity-50 bg-destructive bg-opacity-5">
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              تنبيه: أصناف تنتهي خلال 30 يوماً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringItems.filter((i) => i.daysLeft <= 30).map((item) => <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} {item.kitchen} • {item.warehouse}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.expirationDate}</span>
                    <Badge variant="danger">{item.daysLeft} يوم</Badge>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>}

      {
    /* Full list */
  }
      <div className="lg:hidden space-y-3">
        {filtered.map((item) => <div key={item.id} className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-right">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.id} • {item.category}</p>
              </div>
              {getUrgencyBadge(item.daysLeft)}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-right">
              <div><p className="text-muted-foreground">الكمية</p><p className="font-medium">{item.quantity} {item.kitchen}</p></div>
              <div><p className="text-muted-foreground">تاريخ الانتهاء</p><p className="font-medium">{item.expirationDate}</p></div>
              <div><p className="text-muted-foreground">المستودع</p><p className="font-medium">{item.warehouse}</p></div>
            </div>
          </div>)}
      </div>

      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {["\u0631\u0645\u0632 \u0627\u0644\u0635\u0646\u0641", "\u0627\u0633\u0645 \u0627\u0644\u0635\u0646\u0641", "\u0627\u0644\u0641\u0626\u0629", "\u0627\u0644\u0643\u0645\u064A\u0629", "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621", "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639", "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0625\u0644\u062D\u0627\u062D"].map((h) => <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((item) => <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-mono text-sm">{item.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                <td className="px-4 py-3 text-foreground">{item.category}</td>
                <td className="px-4 py-3">{item.quantity} {item.kitchen}</td>
                <td className="px-4 py-3 text-foreground">{item.expirationDate}</td>
                <td className="px-4 py-3 text-foreground">{item.warehouse}</td>
                <td className="px-4 py-3">{getUrgencyBadge(item.daysLeft)}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export {
  ExpirationMonitorAr
};
