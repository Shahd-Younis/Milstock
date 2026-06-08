import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import { AlertTriangle, Info, CheckCircle, Clock, Check } from "lucide-react";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
import { formatDate } from "../lib/format";
const severityConfig = {
  danger: { iconBg: "bg-[#D4183D]/10", iconColor: "text-[#D4183D]", accent: "border-l-[#D4183D]" },
  warning: { iconBg: "bg-[#B8862A]/10", iconColor: "text-[#B8862A]", accent: "border-l-[#B8862A]" },
  success: { iconBg: "bg-[#5B8A4A]/10", iconColor: "text-[#5B8A4A]", accent: "border-l-[#5B8A4A]" },
  info: { iconBg: "bg-[#6A7B4D]/10", iconColor: "text-[#6A7B4D]", accent: "border-l-[#6A7B4D]" },
  pending: { iconBg: "bg-[#4E4631]/10", iconColor: "text-[#4E4631]", accent: "border-l-[#4E4631]" }
};
const getSeverity = (type) => {
  if (type.includes("low")) return "danger";
  if (type.includes("expir")) return "warning";
  if (type.includes("order")) return "success";
  if (type.includes("consumption")) return "info";
  return "pending";
};
const getIcon = (type) => {
  const severity = getSeverity(type);
  if (severity === "danger") return AlertTriangle;
  if (severity === "success") return CheckCircle;
  if (severity === "pending") return Clock;
  return Info;
};
const NotificationsPage = () => {
  const { data, loading, error } = useApiResource(() => api.notifications.list(), []);
  const [localRead, setLocalRead] = useState({});
  const notifications = data.map((notification) => ({
    ...notification,
    is_read: localRead[notification._id] ?? notification.is_read
  }));
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const markAllRead = () => {
    setLocalRead(Object.fromEntries(notifications.map((notification) => [notification._id, true])));
  };
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
    title="Notifications"
    subtitle="Stay updated on inventory alerts and request status"
    badge={unreadCount > 0 ? <span className="px-2 py-0.5 bg-[#D4183D] text-white text-xs font-bold rounded-lg">{unreadCount}</span> : void 0}
    action={unreadCount > 0 ? { label: "Mark All Read", onClick: markAllRead, icon: Check } : void 0}
  />

      <p className="text-sm text-[#5A6B50]">
        {loading ? "Loading notifications from MongoDB..." : error || `${notifications.length} notifications loaded`}
      </p>

      <div className="space-y-3">
        {!loading && notifications.length === 0 && <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-8 text-center text-sm text-[#5A6B50]">
            {error || "No MongoDB notifications found. Run npm run seed in the backend."}
          </div>}
        {notifications.map((notification) => {
    const Icon = getIcon(notification.type);
    const config = severityConfig[getSeverity(notification.type)];
    return <div
      key={notification._id}
      className={`bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${!notification.is_read ? `border-l-4 ${config.accent} border-[#4E4631]/10` : "border-[#4E4631]/10"}`}
    >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${config.iconBg}`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-semibold text-[#2E3A24]">{notification.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.is_read && <Badge variant="info" size="sm">New</Badge>}
                      <span className="text-xs text-[#5A6B50] whitespace-nowrap">{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#5A6B50] leading-relaxed">{notification.message}</p>
                </div>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
export {
  NotificationsPage
};
