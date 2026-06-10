import { Link, useLocation } from "react-router";
import { Bell, ChevronDown, Globe, User } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
const pageTitleMap = {
  "/ar/admin/dashboard": "\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0645\u0633\u0624\u0648\u0644",
  "/ar/admin/inventory": "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646",
  "/ar/admin/inventory/add": "\u0625\u0636\u0627\u0641\u0629 \u0635\u0646\u0641 \u062C\u062F\u064A\u062F",
  "/ar/admin/inventory/logs": "\u0633\u062C\u0644 \u0627\u0644\u062D\u0631\u0643\u0629",
  "/ar/admin/inventory/expiration": "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629",
  "/ar/admin/inventory/warehouses": "\u0645\u0648\u0627\u0642\u0639 \u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A",
  "/ar/admin/requests": "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A",
  "/ar/admin/requests/pending": "\u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0651\u0642\u0629",
  "/ar/admin/notifications": "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A",
  "/ar/admin/reports": "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0644\u0627\u062A",
  "/ar/admin/audit-logs": "\u0633\u062C\u0644 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A",
  "/ar/admin/users": "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646",
  "/ar/admin/settings": "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645",
  "/ar/user/dashboard": "\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0648\u062D\u062F\u0629",
  "/ar/user/inventory": "\u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0627\u0644\u0645\u062A\u0627\u062D",
  "/ar/user/requests": "\u0637\u0644\u0628\u0627\u062A\u064A",
  "/ar/user/requests/create": "\u0625\u0646\u0634\u0627\u0621 \u0637\u0644\u0628",
  "/ar/user/notifications": "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A",
  "/ar/profile": "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A",
  "/ar/help": "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629"
};
const subtitleMap = {
  "/ar/admin/dashboard": "\u0646\u0638\u0631\u0629 \u0634\u0627\u0645\u0644\u0629 \u0639\u0644\u0649 \u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646",
  "/ar/admin/inventory": "\u0625\u062F\u0627\u0631\u0629 \u062C\u0645\u064A\u0639 \u0623\u0635\u0646\u0627\u0641 \u0627\u0644\u0645\u062E\u0632\u0648\u0646",
  "/ar/admin/reports": "\u0627\u0644\u062A\u062D\u0644\u064A\u0644\u0627\u062A \u0648\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631",
  "/ar/user/dashboard": "\u0645\u062A\u0627\u0628\u0639\u0629 \u0625\u0645\u062F\u0627\u062F\u0627\u062A \u0648\u062D\u062F\u062A\u0643"
};
const NavbarAr = ({ userRole }) => {
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const title = pageTitleMap[location.pathname] ?? "MilStock";
  const subtitle = subtitleMap[location.pathname];
  const notifPath = userRole === "admin" ? "/ar/admin/notifications" : "/ar/user/notifications";
  const enPath = userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
  return <div className="h-16 bg-white border-b border-[#4E4631]/10 px-6 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-[0_1px_3px_rgba(46,58,36,0.06)]">
      {
    /* Right: Page title — first in DOM = right side in RTL ✓ */
  }
      <div className="min-w-0 text-right">
        <h2 className="text-[#2E3A24] leading-none truncate">{title}</h2>
        {subtitle && <p className="text-xs text-[#5A6B50] mt-0.5">{subtitle}</p>}
      </div>

      {
    /* Left: Actions — second in DOM = left side in RTL */
  }
      {
    /* RTL order (right → left): User Profile | Bell | Language */
  }
      <div className="flex items-center gap-2 flex-shrink-0">
        {
    /* User — first in DOM = rightmost in RTL (closest to title) */
  }
        <Link
    to="/ar/profile"
    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-[#4B5B3A]/8 transition-colors border-l border-[#4E4631]/10"
  >
          <div className="w-7 h-7 rounded-lg bg-[#6A7B4D] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-[#2E3A24] leading-none">
              {userRole === "admin" ? "\u0645\u0633\u0624\u0648\u0644" : "\u0645\u0633\u062A\u062E\u062F\u0645"}
            </p>
            <p className="text-[10px] text-[#5A6B50] mt-0.5">
              {userRole === "admin" ? "\u0645\u062F\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645" : "\u0645\u0642\u062F\u0651\u0645 \u0637\u0644\u0628"}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#5A6B50] hidden sm:block" />
        </Link>

        {
    /* Notifications — second in DOM = middle in RTL */
  }
        <Link
    to={notifPath}
    className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#4B5B3A]/8 transition-colors text-[#4E4631]"
  >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#D4183D] text-white text-[10px] leading-4 text-center rounded-full ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>}
        </Link>

        {
    /* Language switcher — last in DOM = leftmost in RTL */
  }
        <Link
    to={enPath}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#4B5B3A]/20 text-[#4B5B3A] hover:bg-[#4B5B3A]/8 transition-colors"
  >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">English</span>
        </Link>
      </div>
    </div>;
};
export {
  NavbarAr
};
