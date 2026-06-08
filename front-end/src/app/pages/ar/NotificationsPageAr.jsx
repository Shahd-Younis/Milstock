import { useState } from "react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { Bell, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
const notifications = [
  { id: "1", title: "\u062A\u0646\u0628\u064A\u0647 \u0627\u0646\u062E\u0641\u0627\u0636 \u0627\u0644\u0645\u062E\u0632\u0648\u0646", message: "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u063A\u0630\u064A\u0629 \u0627\u0644\u0623\u0644\u0628\u0627\u0646\u0629 \u0641\u064A \u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 B \u0623\u0635\u0628\u062D \u062F\u0648\u0646 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0627\u0644\u0645\u0633\u0645\u0648\u062D \u0628\u0647 (150 \u0648\u062D\u062F\u0629)", type: "alert", category: "\u0627\u0644\u0645\u062E\u0632\u0648\u0646", time: "\u0645\u0646\u0630 5 \u062F\u0642\u0627\u0626\u0642", read: false },
  { id: "2", title: "\u0637\u0644\u0628 \u062C\u062F\u064A\u062F \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629", message: "\u0645\u0637\u0628\u062E \u0627\u0644\u0645\u062E\u0628\u0648\u0632\u0627\u062A \u0623\u0631\u0633\u0644\u062A \u0637\u0644\u0628 \u062A\u0648\u0631\u064A\u062F REQ-1234 \u0628\u0623\u0648\u0644\u0648\u064A\u0629 \u0639\u0627\u062C\u0644\u0629", type: "warning", category: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", time: "\u0645\u0646\u0630 15 \u062F\u0642\u064A\u0642\u0629", read: false },
  { id: "3", title: "\u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0637\u0644\u0628", message: "\u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0637\u0644\u0628\u0643 REQ-1233 \u0648\u062C\u0627\u0631\u064D \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0625\u0645\u062F\u0627\u062F", type: "success", category: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", time: "\u0645\u0646\u0630 \u0633\u0627\u0639\u0629", read: false },
  { id: "4", title: "\u0627\u0642\u062A\u0631\u0627\u0628 \u062A\u0627\u0631\u064A\u062E \u0627\u0646\u062A\u0647\u0627\u0621 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629", message: "50 \u0635\u0646\u0641\u0627\u064B \u0633\u062A\u0646\u062A\u0647\u064A \u0635\u0644\u0627\u062D\u064A\u062A\u0647\u0627 \u062E\u0644\u0627\u0644 7 \u0623\u064A\u0627\u0645 \u2014 \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629", type: "warning", category: "\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629", time: "\u0645\u0646\u0630 2 \u0633\u0627\u0639\u0629", read: true },
  { id: "5", title: "\u0627\u0643\u062A\u0645\u0627\u0644 \u0627\u0644\u062C\u0631\u062F \u0627\u0644\u0634\u0647\u0631\u064A", message: "\u062A\u0645 \u0625\u0646\u062C\u0627\u0632 \u0627\u0644\u062A\u062F\u0642\u064A\u0642 \u0627\u0644\u0634\u0647\u0631\u064A \u0644\u0644\u0645\u062E\u0632\u0648\u0646 \u0628\u0646\u062C\u0627\u062D \u062A\u0627\u0645 \u062F\u0648\u0646 \u0623\u064A \u062A\u0628\u0627\u064A\u0646", type: "success", category: "\u0627\u0644\u0646\u0638\u0627\u0645", time: "\u0645\u0646\u0630 3 \u0633\u0627\u0639\u0627\u062A", read: true },
  { id: "6", title: "\u062A\u0633\u0644\u064A\u0645 \u0646\u0627\u062C\u062D", message: "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0637\u0644\u0628 REQ-1232 \u0625\u0644\u0649 \u0645\u0637\u0628\u062E \u0627\u0644\u062E\u0636\u0631\u0648\u0627\u062A \u0628\u0646\u062C\u0627\u062D", type: "info", category: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", time: "\u0623\u0645\u0633", read: true },
  { id: "7", title: "\u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645", message: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0648\u0635\u0648\u0644 \u0644\u0644\u0645\u0644\u0627\u0632\u0645 \u062E\u0627\u0644\u062F", type: "info", category: "\u0627\u0644\u0646\u0638\u0627\u0645", time: "\u0623\u0645\u0633", read: true }
];
const typeConfig = {
  alert: { icon: AlertTriangle, variant: "danger", color: "text-destructive bg-destructive bg-opacity-10" },
  warning: { icon: AlertTriangle, variant: "warning", color: "text-[#C9A961] bg-[#C9A961] bg-opacity-10" },
  success: { icon: CheckCircle, variant: "success", color: "text-[#6A7B4D] bg-[#6A7B4D] bg-opacity-10" },
  info: { icon: Info, variant: "info", color: "text-[#4B5B3A] bg-[#4B5B3A] bg-opacity-10" }
};
const categoryLabels = {
  "all": "\u0627\u0644\u0643\u0644",
  "\u0627\u0644\u0645\u062E\u0632\u0648\u0646": "\u0627\u0644\u0645\u062E\u0632\u0648\u0646",
  "\u0627\u0644\u0637\u0644\u0628\u0627\u062A": "\u0627\u0644\u0637\u0644\u0628\u0627\u062A",
  "\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629": "\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629",
  "\u0627\u0644\u0646\u0638\u0627\u0645": "\u0627\u0644\u0646\u0638\u0627\u0645"
};
const NotificationsPageAr = () => {
  const [filter, setFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [notifs, setNotifs] = useState(notifications);
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const filtered = notifs.filter((n) => {
    const matchCat = filter === "all" || n.category === filter;
    const matchRead = readFilter === "all" || !n.read;
    return matchCat && matchRead;
  });
  const unreadCount = notifs.filter((n) => !n.read).length;
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
    title="الإشعارات"
    subtitle={`${unreadCount} \u0625\u0634\u0639\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0631\u0648\u0621`}
  />

      {
    /* Filters — RTL: action button on right, toggle filters on left */
  }
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 justify-end">
          {["all", "unread"].map((r) => <button
    key={r}
    onClick={() => setReadFilter(r)}
    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${readFilter === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
  >
              {r === "all" ? "\u062C\u0645\u064A\u0639 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A" : "\u063A\u064A\u0631 \u0627\u0644\u0645\u0642\u0631\u0648\u0621\u0629"}
            </button>)}
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
        {Object.keys(categoryLabels).map((cat) => <button
    key={cat}
    onClick={() => setFilter(cat)}
    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${filter === cat ? "bg-[#4B5B3A] text-white" : "bg-card border border-border text-foreground hover:bg-muted"}`}
  >
            {categoryLabels[cat]}
          </button>)}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-16">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground">لا توجد إشعارات</p>
          </div>}
        {filtered.map((notif) => {
    const config = typeConfig[notif.type];
    const Icon = config.icon;
    return <Card
      key={notif.id}
      className={`transition-all ${!notif.read ? "border-primary border-opacity-30 bg-primary bg-opacity-5" : ""}`}
    >
              <CardContent className="p-4">
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-start justify-between mb-1 flex-row-reverse">
                      <div className="flex items-center gap-2">
                        {!notif.read && <span className="w-2 h-2 bg-[#B85C50] rounded-full flex-shrink-0" />}
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
            </Card>;
  })}
      </div>
    </div>;
};
export {
  NotificationsPageAr
};
