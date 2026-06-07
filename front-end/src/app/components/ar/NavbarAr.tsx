import { Link, useLocation } from 'react-router';
import { Bell, ChevronDown, Globe, User } from 'lucide-react';

const pageTitleMap: Record<string, string> = {
  '/ar/admin/dashboard': 'لوحة تحكم المسؤول',
  '/ar/admin/inventory': 'إدارة المخزون',
  '/ar/admin/inventory/add': 'إضافة صنف جديد',
  '/ar/admin/inventory/logs': 'سجل الحركة',
  '/ar/admin/inventory/expiration': 'متابعة الصلاحية',
  '/ar/admin/inventory/warehouses': 'مواقع المستودعات',
  '/ar/admin/requests': 'إدارة الطلبات',
  '/ar/admin/requests/pending': 'الطلبات المعلّقة',
  '/ar/admin/notifications': 'الإشعارات',
  '/ar/admin/reports': 'التقارير والتحليلات',
  '/ar/admin/audit-logs': 'سجل العمليات',
  '/ar/admin/users': 'إدارة المستخدمين',
  '/ar/admin/settings': 'إعدادات النظام',
  '/ar/user/dashboard': 'لوحة تحكم الوحدة',
  '/ar/user/inventory': 'المخزون المتاح',
  '/ar/user/requests': 'طلباتي',
  '/ar/user/requests/create': 'إنشاء طلب',
  '/ar/user/notifications': 'الإشعارات',
  '/ar/profile': 'الملف الشخصي',
  '/ar/help': 'مركز المساعدة',
};

const subtitleMap: Record<string, string> = {
  '/ar/admin/dashboard': 'نظرة شاملة على عمليات المخزون',
  '/ar/admin/inventory': 'إدارة جميع أصناف المخزون',
  '/ar/admin/reports': 'التحليلات والتقارير',
  '/ar/user/dashboard': 'متابعة إمدادات وحدتك',
};

interface NavbarArProps {
  userRole: 'admin' | 'user';
}

export const NavbarAr = ({ userRole }: NavbarArProps) => {
  const location = useLocation();
  const title = pageTitleMap[location.pathname] ?? 'MilStock';
  const subtitle = subtitleMap[location.pathname];

  const notifPath = userRole === 'admin' ? '/ar/admin/notifications' : '/ar/user/notifications';
  const enPath = userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <div className="h-16 bg-white border-b border-[#4E4631]/10 px-6 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-[0_1px_3px_rgba(46,58,36,0.06)]">
      {/* Right: Page title — first in DOM = right side in RTL ✓ */}
      <div className="min-w-0 text-right">
        <h2 className="text-[#2E3A24] leading-none truncate">{title}</h2>
        {subtitle && (
          <p className="text-xs text-[#5A6B50] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Left: Actions — second in DOM = left side in RTL */}
      {/* RTL order (right → left): User Profile | Bell | Language */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* User — first in DOM = rightmost in RTL (closest to title) */}
        <Link
          to="/ar/profile"
          className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-[#4B5B3A]/8 transition-colors border-l border-[#4E4631]/10"
        >
          <div className="w-7 h-7 rounded-lg bg-[#6A7B4D] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-[#2E3A24] leading-none">
              {userRole === 'admin' ? 'مسؤول' : 'مستخدم'}
            </p>
            <p className="text-[10px] text-[#5A6B50] mt-0.5">
              {userRole === 'admin' ? 'مدير النظام' : 'مقدّم طلب'}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#5A6B50] hidden sm:block" />
        </Link>

        {/* Notifications — second in DOM = middle in RTL */}
        <Link
          to={notifPath}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#4B5B3A]/8 transition-colors text-[#4E4631]"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C0392B] rounded-full ring-2 ring-white" />
        </Link>

        {/* Language switcher — last in DOM = leftmost in RTL */}
        <Link
          to={enPath}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#4B5B3A]/20 text-[#4B5B3A] hover:bg-[#4B5B3A]/8 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">English</span>
        </Link>
      </div>
    </div>
  );
};
