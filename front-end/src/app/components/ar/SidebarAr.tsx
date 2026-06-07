import { Link, useLocation } from 'react-router';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Package,
  FileText,
  Bell,
  BarChart3,
  Users,
  Settings,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MapPin,
  Calendar,
  Shield,
  Clock,
  Menu,
  X,
  Globe,
} from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '../BrandLogo';

interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
  children?: NavItem[];
}

const adminNavGroups = [
  {
    label: 'الرئيسية',
    items: [
      { label: 'لوحة التحكم', path: '/ar/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'المخزون',
    items: [
      {
        label: 'المخزون',
        path: '/ar/admin/inventory',
        icon: Package,
        children: [
          { label: 'جميع الأصناف', path: '/ar/admin/inventory', icon: Package },
          { label: 'إضافة صنف', path: '/ar/admin/inventory/add', icon: Package },
          { label: 'سجل الحركة', path: '/ar/admin/inventory/logs', icon: Clock },
          { label: 'متابعة الصلاحية', path: '/ar/admin/inventory/expiration', icon: Calendar },
          { label: 'المستودعات', path: '/ar/admin/inventory/warehouses', icon: MapPin },
        ],
      },
    ],
  },
  {
    label: 'العمليات',
    items: [
      { label: 'الطلبات', path: '/ar/admin/requests', icon: FileText, badge: 12 },
      { label: 'الإشعارات', path: '/ar/admin/notifications', icon: Bell, badge: 5 },
    ],
  },
  {
    label: 'التحليلات',
    items: [
      {
        label: 'التقارير',
        path: '/ar/admin/reports',
        icon: BarChart3,
        children: [
          { label: 'التحليلات', path: '/ar/admin/reports', icon: BarChart3 },
          { label: 'سجل العمليات', path: '/ar/admin/audit-logs', icon: Shield },
        ],
      },
    ],
  },
  {
    label: 'الإدارة',
    items: [
      { label: 'إدارة المستخدمين', path: '/ar/admin/users', icon: Users },
      { label: 'إعدادات النظام', path: '/ar/admin/settings', icon: Settings },
    ],
  },
];

const userNavGroups = [
  {
    label: 'الرئيسية',
    items: [
      { label: 'لوحة التحكم', path: '/ar/user/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'المخزون',
    items: [
      { label: 'المخزون المتاح', path: '/ar/user/inventory', icon: Package },
    ],
  },
  {
    label: 'الطلبات',
    items: [
      { label: 'طلباتي', path: '/ar/user/requests', icon: FileText },
      { label: 'إنشاء طلب', path: '/ar/user/requests/create', icon: FileText },
    ],
  },
  {
    label: 'الإشعارات',
    items: [
      { label: 'الإشعارات', path: '/ar/user/notifications', icon: Bell, badge: 3 },
    ],
  },
];

interface SidebarArProps {
  userRole: 'admin' | 'user';
}

export const SidebarAr = ({ userRole }: SidebarArProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navGroups = userRole === 'admin' ? adminNavGroups : userNavGroups;

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');
  const isGroupActive = (item: NavItem) =>
    isActive(item.path) || (item.children?.some((c) => isActive(c.path)) ?? false);

  return (
    <div
      className={clsx(
        'h-screen bg-[#2E3A24] text-[#E0E1B7] flex flex-col border-l border-white/[0.06]',
        'transition-all duration-300 ease-in-out relative',
        collapsed ? 'w-[72px]' : 'w-[256px]'
      )}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0">
        {/* RTL: Logo first (→ RIGHT/leading in RTL), collapse button second (→ LEFT/trailing in RTL) */}
        {!collapsed && (
          <BrandLogo
            className="flex-row-reverse text-right"
            subtitle={userRole === 'admin' ? 'Admin Portal' : 'Kitchen Portal'}
          />
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {collapsed && (
          <>
            <BrandLogo compact className="mx-auto" />
            {/* Expand button: protrudes to the LEFT (facing content area) */}
            <button
              onClick={() => setCollapsed(false)}
              className="absolute -left-3 top-[30px] w-6 h-6 bg-[#4B5B3A] rounded-full flex items-center justify-center shadow-md border border-white/10 hover:bg-[#6A7B4D] transition-colors z-10"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-3 h-3 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-3">
            {/* Group label */}
            {!collapsed && (
              <p className="text-[10px] font-semibold text-[#E0E1B7]/40 tracking-widest uppercase px-3 py-1.5 mb-1 text-right">
                {group.label}
              </p>
            )}
            {collapsed && <div className="h-px bg-white/[0.06] mx-2 my-2" />}

            {group.items.map((item) => {
              const active = isGroupActive(item);
              const expanded = expandedItems.includes(item.path);

              return (
                <div key={item.path}>
                  <Link
                    to={item.children ? '#' : item.path}
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault();
                        toggleExpand(item.path);
                      }
                    }}
                    title={collapsed ? item.label : undefined}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative',
                      active
                        ? 'bg-[#4B5B3A]/60 text-white'
                        : 'text-[#E0E1B7]/70 hover:bg-white/[0.06] hover:text-[#E0E1B7]'
                    )}
                  >
                    {/* Active indicator bar — RTL: left side (facing content) */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#6A7B4D] rounded-r-full" />
                    )}

                    {/* Icon always on the right side in RTL */}
                    <item.icon
                      className={clsx(
                        'w-[18px] h-[18px] flex-shrink-0 transition-colors',
                        active ? 'text-[#6A7B4D]' : 'text-[#E0E1B7]/50 group-hover:text-[#E0E1B7]/80'
                      )}
                    />

                    {!collapsed && (
                      <>
                        {item.children && (
                          <ChevronDown
                            className={clsx(
                              'w-3.5 h-3.5 text-[#E0E1B7]/40 transition-transform duration-200',
                              expanded && 'rotate-180'
                            )}
                          />
                        )}
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.5 bg-[#C0392B] text-white text-[10px] font-bold rounded-md leading-none">
                            {item.badge}
                          </span>
                        )}
                        <span className="flex-1 text-sm font-medium text-right">{item.label}</span>
                      </>
                    )}
                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C0392B] rounded-full" />
                    )}
                  </Link>

                  {/* Submenu */}
                  {item.children && expanded && !collapsed && (
                    <div className="mt-0.5 mb-1 mr-3 pr-3 border-r border-white/[0.08] space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={clsx(
                            'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-sm',
                            isActive(child.path)
                              ? 'bg-[#4B5B3A]/50 text-white'
                              : 'text-[#E0E1B7]/60 hover:bg-white/[0.05] hover:text-[#E0E1B7]/90'
                          )}
                        >
                          <child.icon className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          <span className="flex-1 text-right">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/[0.06] space-y-0.5 flex-shrink-0">
        <Link
          to="/ar/profile"
          title={collapsed ? 'الملف الشخصي' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#E0E1B7]/70 hover:bg-white/[0.06] hover:text-[#E0E1B7] transition-colors"
        >
          <User className="w-[18px] h-[18px] flex-shrink-0 opacity-60" />
          {!collapsed && <span className="flex-1 text-sm text-right">الملف الشخصي</span>}
        </Link>
        <Link
          to="/admin/dashboard"
          title={collapsed ? 'English' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C9A961] hover:bg-[#C9A961]/10 transition-colors"
        >
          <Globe className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-sm font-medium text-right">English</span>}
        </Link>
        <Link
          to="/ar/login"
          title={collapsed ? 'تسجيل الخروج' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#E0E1B7]/60 hover:bg-[#C0392B]/15 hover:text-[#ff8a80] transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-sm text-right">تسجيل الخروج</span>}
        </Link>
      </div>
    </div>
  );
};

/* ── Mobile Nav — Arabic RTL ── */
export const MobileNavAr = ({ userRole }: SidebarArProps) => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navGroups = userRole === 'admin' ? adminNavGroups : userNavGroups;
  const allItems = navGroups.flatMap((g) => g.items);

  const bottomItems = allItems.slice(0, 5).map((item) => ({
    label: item.label,
    path: item.children ? item.children[0].path : item.path,
    icon: item.icon,
    badge: item.badge,
  }));

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-50 h-14 bg-[#2E3A24] text-[#E0E1B7] border-b border-white/[0.08] px-4 flex items-center justify-between">
        <Link
          to={userRole === 'admin' ? '/ar/admin/notifications' : '/ar/user/notifications'}
          className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C0392B] rounded-full" />
        </Link>
        <BrandLogo
          subtitle={userRole === 'admin' ? 'Admin' : 'Kitchen'}
          className="flex-row-reverse text-right [&>div:first-child]:w-7 [&>div:first-child]:h-7"
        />
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="w-72 bg-[#2E3A24] text-[#E0E1B7] h-full overflow-y-auto flex flex-col shadow-2xl">
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.08]">
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <BrandLogo
                subtitle={userRole === 'admin' ? 'Admin Portal' : 'Kitchen Portal'}
                className="flex-row-reverse text-right [&>div:first-child]:w-7 [&>div:first-child]:h-7"
              />
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
              {navGroups.map((group) => (
                <div key={group.label} className="mb-3">
                  <p className="text-[10px] font-semibold text-[#E0E1B7]/40 tracking-widest uppercase px-3 py-1.5 text-right">
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.children ? item.children[0].path : item.path}
                      onClick={() => setDrawerOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                        location.pathname.startsWith(item.path)
                          ? 'bg-[#4B5B3A]/60 text-white'
                          : 'text-[#E0E1B7]/70 hover:bg-white/[0.06]'
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 bg-[#C0392B] text-white text-[10px] rounded-md">
                          {item.badge}
                        </span>
                      )}
                      <span className="flex-1 text-sm text-right">{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="p-3 border-t border-white/[0.06] space-y-0.5">
              <Link to="/ar/profile" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#E0E1B7]/70 hover:bg-white/[0.06]">
                <User className="w-[18px] h-[18px]" />
                <span className="flex-1 text-sm text-right">الملف الشخصي</span>
              </Link>
              <Link to="/admin/dashboard" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C9A961] hover:bg-[#C9A961]/10">
                <Globe className="w-[18px] h-[18px]" />
                <span className="flex-1 text-sm text-right">English</span>
              </Link>
              <Link to="/ar/login" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#E0E1B7]/60 hover:bg-[#C0392B]/15">
                <LogOut className="w-[18px] h-[18px]" />
                <span className="flex-1 text-sm text-right">تسجيل الخروج</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 right-0 left-0 z-40 bg-[#2E3A24] text-[#E0E1B7] border-t border-white/[0.08] safe-area-pb">
        <div className="flex items-center justify-around py-1">
          {bottomItems.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-colors relative min-w-0',
                  active
                    ? 'text-white'
                    : 'text-[#E0E1B7]/50 hover:text-[#E0E1B7]/80'
                )}
              >
                <div className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  active ? 'bg-[#4B5B3A]' : ''
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] truncate max-w-[48px] text-center leading-none">{item.label}</span>
                {item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C0392B] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
