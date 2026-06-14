import { StatCardAr } from "../../components/ar/StatCardAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { FileText, Clock, CheckCircle, ArrowRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getStoredAssignedWarehouse } from "../../lib/warehouseDisplay";
import { getLocalizedValue, localizeText } from "../../lib/localization";
const myRequests = [
  { id: "REQ-1230", item: "\u0623\u0631\u0632", quantity: 100, status: "approved", requestedDate: "2026-05-01", deliveryDate: "2026-05-05" },
  { id: "REQ-1228", item: "\u0642\u0648\u0627\u0631\u064A\u0631 \u0645\u064A\u0627\u0647", quantity: 200, status: "pending", requestedDate: "2026-04-30", deliveryDate: "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u062F\u064A\u062F" },
  { id: "REQ-1225", item: "\u062C\u0628\u0646", quantity: 50, status: "delivered", requestedDate: "2026-04-25", deliveryDate: "2026-04-28" }
];
const notifications = [
  { message: "\u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0637\u0644\u0628\u0643 REQ-1230", type: "success", time: "\u0645\u0646\u0630 \u0633\u0627\u0639\u062A\u064A\u0646" },
  { message: "\u0625\u0645\u062F\u0627\u062F\u0627\u062A \u062C\u062F\u064A\u062F\u0629 \u0645\u062A\u0648\u0641\u0631\u0629: \u0645\u0646\u062A\u062C\u0627\u062A \u0623\u0644\u0628\u0627\u0646", type: "info", time: "\u0645\u0646\u0630 5 \u0633\u0627\u0639\u0627\u062A" },
  { message: "\u0637\u0644\u0628 REQ-1228 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", type: "pending", time: "\u0645\u0646\u0630 \u064A\u0648\u0645" }
];
const stockData = [
  { day: "\u0627\u0644\u0633\u0628\u062A", level: 88 },
  { day: "\u0627\u0644\u0623\u062D\u062F", level: 85 },
  { day: "\u0627\u0644\u0627\u062B\u0646\u064A\u0646", level: 82 },
  { day: "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", level: 79 },
  { day: "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", level: 83 },
  { day: "\u0627\u0644\u062E\u0645\u064A\u0633", level: 80 },
  { day: "\u0627\u0644\u062C\u0645\u0639\u0629", level: 77 }
];
const availableStock = [
  { category: "\u063A\u0630\u0627\u0621 \u0648\u062D\u0635\u0635", items: 45, status: "In Stock" },
  { category: "\u0623\u063A\u0630\u064A\u0629 \u0623\u0644\u0628\u0627\u0646\u0629", items: 23, status: "Low Stock" },
  { category: "\u0645\u064A\u0627\u0647 \u0648\u0645\u0634\u0631\u0648\u0628\u0627\u062A", items: 67, status: "In Stock" },
  { category: "\u0645\u062E\u0628\u0648\u0632\u0627\u062A", items: 34, status: "In Stock" }
];
const statusLabels = {
  pending: "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629",
  approved: "\u0645\u0648\u0627\u0641\u0642 \u0639\u0644\u064A\u0647",
  delivered: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
};
const statusVariant = {
  pending: "pending",
  approved: "success",
  delivered: "info"
};
const UserDashboardAr = () => {
  const navigate = useNavigate();
  const assignedWarehouse = getStoredAssignedWarehouse();
  if (!assignedWarehouse.id) {
    return <div className="p-6 lg:p-8">
      <Card>
        <CardContent className="py-10 text-center text-[#D4183D]">
          لم يتم تعيين مخزن لهذا المستخدم. يرجى التواصل مع المسؤول.
        </CardContent>
      </Card>
    </div>;
  }
  return <div className="p-6 lg:p-8 space-y-8">
      {
    /* Header action */
  }
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm font-medium text-[#2E3A24] text-right">المخزن: {getLocalizedValue(assignedWarehouse, "name", "ar") || localizeText(assignedWarehouse.name, "ar") || "غير محدد"}</p>
        <Button onClick={() => navigate("/ar/user/requests/create")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إنشاء طلب جديد
        </Button>
      </div>

      {
    /* KPI Stats */
  }
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <StatCardAr title="الطلبات النشطة" value="2" icon={FileText} trend={{ value: "\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 1 \u0627\u0644\u064A\u0648\u0645", isPositive: true }} color="primary" />
        <StatCardAr title="بانتظار الموافقة" value="1" icon={Clock} trend={{ value: "\u0648\u0642\u062A \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629 ~18 \u0633\u0627\u0639\u0629", isPositive: true }} color="warning" />
        <StatCardAr title="مكتملة هذا الشهر" value="8" icon={CheckCircle} trend={{ value: "+3 \u0645\u0642\u0627\u0631\u0646\u0629 \u0628\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0645\u0627\u0636\u064A", isPositive: true }} color="success" />
      </div>

      {
    /* Charts + Notifications */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {
    /* Stock trend */
  }
        <Card className="lg:col-span-2">
          <CardHeader>
            <span className="text-xs text-muted-foreground">% من الطاقة الاستيعابية</span>
            <CardTitle className="text-right">مستوى المخزون — هذا الأسبوع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stockData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid key="usr-ar-lc-grid" strokeDasharray="3 3" stroke="#4E4631" opacity={0.07} />
                <XAxis key="usr-ar-lc-xaxis" dataKey="day" stroke="#5A6B50" tick={{ fontSize: 11, fill: "#5A6B50" }} axisLine={false} tickLine={false} />
                <YAxis key="usr-ar-lc-yaxis" stroke="#5A6B50" tick={{ fontSize: 11, fill: "#5A6B50" }} axisLine={false} tickLine={false} domain={[60, 100]} width={35} />
                <Tooltip
    key="usr-ar-lc-tooltip"
    contentStyle={{ backgroundColor: "#fff", border: "1px solid rgba(78,70,49,0.15)", borderRadius: 10, fontSize: 12 }}
    formatter={(value) => [`${value}%`, "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0645\u062E\u0632\u0648\u0646"]}
  />
                <Line key="usr-ar-lc-level" type="monotone" dataKey="level" stroke="#6A7B4D" strokeWidth={2.5} dot={{ fill: "#6A7B4D", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {
    /* Notifications */
  }
        <Card>
          <CardHeader>
            <Link to="/ar/user/notifications">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                الكل
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <CardTitle className="text-right">الإشعارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((n, i) => <div
    key={i}
    className={`flex items-start gap-3 p-3.5 rounded-xl border flex-row-reverse ${n.type === "success" ? "bg-[#5B8A4A]/5 border-[#5B8A4A]/15" : n.type === "pending" ? "bg-[#B8862A]/5 border-[#B8862A]/15" : "bg-[#6A7B4D]/5 border-[#6A7B4D]/15"}`}
  >
                  <div className={`w-1.5 flex-shrink-0 rounded-full self-stretch mt-0.5 ${n.type === "success" ? "bg-[#5B8A4A]" : n.type === "pending" ? "bg-[#B8862A]" : "bg-[#6A7B4D]"}`} />
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm text-[#2E3A24] mb-0.5">{n.message}</p>
                    <p className="text-xs text-[#5A6B50]">{n.time}</p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {
    /* My Requests + Available Stock */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {
    /* Requests */
  }
        <Card className="lg:col-span-2">
          <CardHeader>
            <Link to="/ar/user/requests">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                عرض الكل <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <CardTitle className="text-right">طلباتي الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myRequests.map((req) => <Link
    key={req.id}
    to={`/ar/user/requests/${req.id}`}
    className="flex items-start justify-between p-4 rounded-xl bg-[#ECEEE2]/60 hover:bg-[#ECEEE2] border border-transparent hover:border-[#4E4631]/10 transition-all group"
  >
                  <div className="flex items-center gap-2 mr-3 flex-shrink-0">
                    <Badge variant={statusVariant[req.status]}>{statusLabels[req.status]}</Badge>
                    <ArrowRight className="w-4 h-4 text-[#5A6B50] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-right min-w-0">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span className="text-sm font-semibold text-[#2E3A24]">{req.id}</span>
                    </div>
                    <p className="text-sm text-[#2E3A24] mb-1">{req.item} <span className="text-[#5A6B50]">× {req.quantity}</span></p>
                    <div className="flex items-center gap-4 text-xs text-[#5A6B50] justify-end">
                      <span>التسليم: {req.deliveryDate}</span>
                      <span>تاريخ الطلب: {req.requestedDate}</span>
                    </div>
                  </div>
                </Link>)}
            </div>
          </CardContent>
        </Card>

        {
    /* Available Stock */
  }
        <Card>
          <CardHeader>
            <CardTitle className="text-right">المخزون المتاح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableStock.map((stock, i) => <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-[#ECEEE2]/60 border border-[#4E4631]/8">
                  <Badge variant={stock.status === "Low Stock" ? "warning" : "success"} size="sm">
                    {stock.status === "Low Stock" ? "\u0645\u062E\u0632\u0648\u0646 \u0645\u0646\u062E\u0641\u0636" : "\u0645\u062A\u0648\u0641\u0631"}
                  </Badge>
                  <div className="text-right min-w-0">
                    <p className="text-sm font-medium text-[#2E3A24] truncate">{stock.category}</p>
                    <p className="text-xs text-[#5A6B50] mt-0.5">{stock.items} صنف</p>
                  </div>
                </div>)}
              <Link to="/ar/user/inventory" className="block mt-2">
                <Button variant="outline" size="sm" className="w-full">
                  تصفح المخزون
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export {
  UserDashboardAr
};
