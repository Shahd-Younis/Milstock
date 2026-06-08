import { useParams, useNavigate } from "react-router";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { ArrowRight, CheckCircle, XCircle, Clock, Package, User, Calendar, MessageSquare } from "lucide-react";
const timeline = [
  { status: "\u062A\u0645 \u0627\u0644\u0625\u0646\u0634\u0627\u0621", date: "2026-05-02 09:15", by: "\u0645\u0646\u0633\u0642 \u0627\u0644\u0645\u0637\u0628\u062E \u0645\u062D\u0645\u062F \u0639\u0644\u064A", icon: Package, color: "text-[#4B5B3A]" },
  { status: "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", date: "2026-05-02 09:30", by: "\u0627\u0644\u0646\u0638\u0627\u0645", icon: Clock, color: "text-[#C9A961]" },
  { status: "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0645\u0633\u0624\u0648\u0644", date: "2026-05-03 10:00", by: "\u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0629 \u0627\u0644\u0622\u0644\u064A\u0629", icon: Clock, color: "text-[#C9A961]" }
];
const requestItems = [
  { name: "\u0623\u0631\u0632", quantity: 300, kitchen: "\u0635\u0646\u062F\u0648\u0642", category: "\u063A\u0630\u0627\u0621" },
  { name: "\u0645\u064A\u0627\u0647 \u0645\u0639\u0628\u0623\u0629 1.5 \u0644\u062A\u0631", quantity: 1200, kitchen: "\u0642\u0627\u0631\u0648\u0631\u0629", category: "\u063A\u0630\u0627\u0621" },
  { name: "\u062D\u0644\u064A\u0628", quantity: 50, kitchen: "\u0642\u0646\u064A\u0646\u0629", category: "\u0623\u063A\u0630\u064A\u0629" }
];
const RequestDetailsAr = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = {
    id: id || "REQ-1234",
    kitchen: "\u0627\u0644\u0645\u0637\u0628\u062E \u0627\u0644\u0645\u0631\u0643\u0632\u064A",
    requestedBy: "\u0645\u0646\u0633\u0642 \u0627\u0644\u0645\u0637\u0628\u062E \u0645\u062D\u0645\u062F \u0639\u0644\u064A",
    priority: "high",
    status: "pending",
    requestedDate: "2026-05-02",
    deliveryDate: "2026-05-10",
    justification: "\u0648\u062D\u062F\u062A\u0646\u0627 \u0641\u064A \u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0634\u0645\u0627\u0644\u064A\u0629 \u062A\u0648\u0627\u062C\u0647 \u0646\u0642\u0635\u0627\u064B \u062D\u0627\u062F\u0627\u064B \u0641\u064A \u0627\u0644\u0645\u0624\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629. \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u062A\u0643\u0641\u064A \u0644\u0640 3 \u0623\u064A\u0627\u0645 \u0641\u0642\u0637. \u0645\u0637\u0644\u0648\u0628 \u0627\u0644\u0625\u0645\u062F\u0627\u062F \u0642\u0628\u0644 \u0628\u062F\u0621 \u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0642\u0627\u062F\u0645\u0629."
  };
  const isAdmin = location.pathname.includes("/ar/admin");
  return <div className="p-6 lg:p-8 space-y-6">
      <div className="mb-2">
        <button
    onClick={() => navigate(isAdmin ? "/ar/admin/requests" : "/ar/user/requests")}
    className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm flex-row-reverse"
  >
          <ArrowRight className="w-4 h-4" />
          العودة إلى الطلبات
        </button>
      </div>

      <PageHeaderAr
    title={`\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 ${request.id}`}
    subtitle={`${request.kitchen} \u2022 ${request.requestedDate}`}
  />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Main details */
  }
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={request.status === "pending" ? "pending" : "success"}>
                  {request.status === "pending" ? "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629" : "\u0645\u0648\u0627\u0641\u0642 \u0639\u0644\u064A\u0647"}
                </Badge>
                <CardTitle className="text-right">معلومات الطلب</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-5">
                {[
    { label: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628", value: request.id, icon: Package },
    { label: "\u0627\u0644\u0645\u0637\u0628\u062E", value: request.kitchen, icon: User },
    { label: "\u0645\u0642\u062F\u0651\u0645 \u0627\u0644\u0637\u0644\u0628", value: request.requestedBy, icon: User },
    { label: "\u0627\u0644\u0623\u0648\u0644\u0648\u064A\u0629", value: "\u0639\u0627\u0644\u064A\u0629", icon: Clock },
    { label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628", value: request.requestedDate, icon: Calendar },
    { label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0637\u0644\u0648\u0628", value: request.deliveryDate, icon: Calendar }
  ].map((f) => <div key={f.label} className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                    <p className="font-medium text-foreground">{f.value}</p>
                  </div>)}
              </div>
              <div className="mt-5 pt-5 border-t border-border text-right">
                <p className="text-xs text-muted-foreground mb-2">مبرر الطلب</p>
                <p className="text-foreground text-sm leading-relaxed">{request.justification}</p>
              </div>
            </CardContent>
          </Card>

          {
    /* Items table */
  }
          <Card>
            <CardHeader>
              <CardTitle className="text-right">الأصناف المطلوبة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="border-b border-border">
                    <tr>
                      {["\u0627\u0633\u0645 \u0627\u0644\u0635\u0646\u0641", "\u0627\u0644\u0641\u0626\u0629", "\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629"].map((h) => <th key={h} className="pb-3 text-sm font-medium text-muted-foreground">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requestItems.map((item, i) => <tr key={i} className="hover:bg-muted/20">
                        <td className="py-3 font-medium text-foreground">{item.name}</td>
                        <td className="py-3 text-foreground">{item.category}</td>
                        <td className="py-3 font-medium">{item.quantity} {item.kitchen}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {
    /* Admin comment */
  }
          {isAdmin && request.status === "pending" && <Card>
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
            </Card>}
        </div>

        {
    /* Sidebar: timeline */
  }
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">سجل الحالة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-border" />
                {timeline.map((event, i) => <div key={i} className="flex items-start gap-3 flex-row-reverse relative">
                    <div className={`p-2 bg-card border border-border rounded-full z-10 ${event.color}`}>
                      <event.icon className="w-4 h-4" />
                    </div>
                    <div className="text-right flex-1">
                      <p className="font-medium text-foreground text-sm">{event.status}</p>
                      <p className="text-xs text-muted-foreground">{event.by}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              {!isAdmin && request.status === "pending" && <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-white">
                  إلغاء الطلب
                </Button>}
              <Button variant="outline" className="w-full">
                طباعة الطلب
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export {
  RequestDetailsAr
};
