import { Link, useLocation } from 'react-router';
import { Bell, ChevronDown, Globe, User } from 'lucide-react';

const pageTitleMap: Record<string, string> = {
  '/admin/dashboard': 'Command Dashboard',
  '/admin/inventory': 'Inventory Management',
  '/admin/inventory/add': 'Add Inventory Item',
  '/admin/inventory/logs': 'Movement Logs',
  '/admin/inventory/expiration': 'Expiration Monitor',
  '/admin/inventory/warehouses': 'Warehouse Locations',
  '/admin/requests': 'Request Management',
  '/admin/requests/pending': 'Pending Approvals',
  '/admin/notifications': 'Notifications',
  '/admin/reports': 'Reports & Analytics',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/users': 'User Management',
  '/admin/settings': 'System Settings',
  '/admin/profile': 'My Profile',
  '/admin/help': 'Help Center',
  '/user/dashboard': 'Kitchen Dashboard',
  '/user/inventory': 'Available Stock',
  '/user/requests': 'My Requests',
  '/user/requests/create': 'Create Request',
  '/user/notifications': 'Notifications',
  '/profile': 'My Profile',
  '/help': 'Help Center',
};

const subtitleMap: Record<string, string> = {
  '/admin/dashboard': 'Overview of inventory operations',
  '/admin/inventory': 'Manage all stock items',
  '/admin/reports': 'Analytics and reporting',
  '/user/dashboard': 'Monitor your kitchen supply',
};

interface NavbarProps {
  userRole: 'admin' | 'user';
}

export const Navbar = ({ userRole }: NavbarProps) => {
  const location = useLocation();
  const title = pageTitleMap[location.pathname] ?? 'MilStock';
  const subtitle = subtitleMap[location.pathname];

  const notifPath = userRole === 'admin' ? '/admin/notifications' : '/user/notifications';
  const arPath = userRole === 'admin' ? '/ar/admin/dashboard' : '/ar/user/dashboard';

  return (
    <div className="h-16 bg-white border-b border-[#4E4631]/10 px-6 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-[0_1px_3px_rgba(46,58,36,0.06)]">
      {/* Left: Page title */}
      <div className="min-w-0">
        <h2 className="text-[#2E3A24] leading-none truncate">{title}</h2>
        {subtitle && (
          <p className="text-xs text-[#5A6B50] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Language switcher */}
        <Link
          to={arPath}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#4B5B3A]/20 text-[#4B5B3A] hover:bg-[#4B5B3A]/8 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">عربي</span>
        </Link>

        {/* Notifications */}
        <Link
          to={notifPath}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#4B5B3A]/8 transition-colors text-[#4E4631]"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C0392B] rounded-full ring-2 ring-white" />
        </Link>

        {/* User */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-[#4B5B3A]/8 transition-colors border-l border-[#4E4631]/10"
        >
          <div className="w-7 h-7 rounded-lg bg-[#6A7B4D] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#2E3A24] leading-none">
              {userRole === 'admin' ? 'Admin' : 'Kitchen User'}
            </p>
            <p className="text-[10px] text-[#5A6B50] mt-0.5">
              {userRole === 'admin' ? 'Administrator' : 'Requester'}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#5A6B50] hidden sm:block" />
        </Link>
      </div>
    </div>
  );
};
