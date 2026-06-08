import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { InventoryList } from "./pages/InventoryList";
import { ItemDetails } from "./pages/ItemDetails";
import { AddInventoryItem } from "./pages/AddInventoryItem";
import { MovementLogs } from "./pages/MovementLogs";
import { WarehouseLocations } from "./pages/WarehouseLocations";
import { CreateRequest } from "./pages/CreateRequest";
import { RequestsList } from "./pages/RequestsList";
import { RequestDetails } from "./pages/RequestDetails";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { AuditLogs } from "./pages/AuditLogs";
import { ProfilePage } from "./pages/ProfilePage";
import { UserManagement } from "./pages/UserManagement";
import { SettingsPage } from "./pages/SettingsPage";
import { ExpirationMonitor } from "./pages/ExpirationMonitor";
import { NotFound } from "./pages/NotFound";
import { AccessDenied } from "./pages/AccessDenied";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoginPageAr } from "./pages/ar/LoginPageAr";
import { AdminDashboardAr } from "./pages/ar/AdminDashboardAr";
import { UserDashboardAr } from "./pages/ar/UserDashboardAr";
import { InventoryListAr } from "./pages/ar/InventoryListAr";
import { ItemDetailsAr } from "./pages/ar/ItemDetailsAr";
import { AddInventoryItemAr } from "./pages/ar/AddInventoryItemAr";
import { MovementLogsAr } from "./pages/ar/MovementLogsAr";
import { ExpirationMonitorAr } from "./pages/ar/ExpirationMonitorAr";
import { WarehouseLocationsAr } from "./pages/ar/WarehouseLocationsAr";
import { RequestsListAr } from "./pages/ar/RequestsListAr";
import { CreateRequestAr } from "./pages/ar/CreateRequestAr";
import { RequestDetailsAr } from "./pages/ar/RequestDetailsAr";
import { NotificationsPageAr } from "./pages/ar/NotificationsPageAr";
import { ReportsPageAr } from "./pages/ar/ReportsPageAr";
import { AuditLogsAr } from "./pages/ar/AuditLogsAr";
import { UserManagementAr } from "./pages/ar/UserManagementAr";
import { SettingsPageAr } from "./pages/ar/SettingsPageAr";
import { ProfilePageAr } from "./pages/ar/ProfilePageAr";
import { NotFoundAr } from "./pages/ar/NotFoundAr";
import { AccessDeniedAr } from "./pages/ar/AccessDeniedAr";
import { DashboardLayoutAr } from "./components/ar/DashboardLayoutAr";
import { LanguageSelect } from "./pages/LanguageSelect";
const router = createBrowserRouter([
  // ── Root: language selector ────────────────────────
  { path: "/", Component: LanguageSelect },
  // ── English routes ────────────────────────────────
  { path: "/login", Component: LoginPage },
  { path: "/403", Component: AccessDenied },
  {
    path: "/admin",
    Component: DashboardLayout,
    children: [
      { path: "dashboard", Component: AdminDashboard },
      { path: "inventory", Component: InventoryList },
      { path: "inventory/add", Component: AddInventoryItem },
      { path: "inventory/logs", Component: MovementLogs },
      { path: "inventory/expiration", Component: ExpirationMonitor },
      { path: "inventory/warehouses", Component: WarehouseLocations },
      { path: "inventory/:id", Component: ItemDetails },
      { path: "inventory/:id/edit", Component: AddInventoryItem },
      { path: "requests", Component: RequestsList },
      { path: "requests/pending", Component: RequestsList },
      { path: "requests/:id", Component: RequestDetails },
      { path: "notifications", Component: NotificationsPage },
      { path: "reports", Component: ReportsPage },
      { path: "audit-logs", Component: AuditLogs },
      { path: "users", Component: UserManagement },
      { path: "settings", Component: SettingsPage }
    ]
  },
  {
    path: "/user",
    Component: DashboardLayout,
    children: [
      { path: "dashboard", Component: UserDashboard },
      { path: "inventory", Component: InventoryList },
      { path: "requests", Component: RequestsList },
      { path: "requests/create", Component: CreateRequest },
      { path: "requests/:id", Component: RequestDetails },
      { path: "notifications", Component: NotificationsPage }
    ]
  },
  {
    path: "/profile",
    Component: DashboardLayout,
    children: [{ index: true, Component: ProfilePage }]
  },
  { path: "*", Component: NotFound },
  // ── Arabic (RTL) routes ────────────────────────────
  { path: "/ar/login", Component: LoginPageAr },
  { path: "/ar/403", Component: AccessDeniedAr },
  // Arabic Admin routes
  {
    path: "/ar/admin",
    Component: DashboardLayoutAr,
    children: [
      { path: "dashboard", Component: AdminDashboardAr },
      { path: "inventory", Component: InventoryListAr },
      { path: "inventory/add", Component: AddInventoryItemAr },
      { path: "inventory/logs", Component: MovementLogsAr },
      { path: "inventory/expiration", Component: ExpirationMonitorAr },
      { path: "inventory/warehouses", Component: WarehouseLocationsAr },
      { path: "inventory/:id", Component: ItemDetailsAr },
      { path: "inventory/:id/edit", Component: AddInventoryItemAr },
      { path: "requests", Component: RequestsListAr },
      { path: "requests/pending", Component: RequestsListAr },
      { path: "requests/:id", Component: RequestDetailsAr },
      { path: "notifications", Component: NotificationsPageAr },
      { path: "reports", Component: ReportsPageAr },
      { path: "audit-logs", Component: AuditLogsAr },
      { path: "users", Component: UserManagementAr },
      { path: "settings", Component: SettingsPageAr }
    ]
  },
  // Arabic User routes
  {
    path: "/ar/user",
    Component: DashboardLayoutAr,
    children: [
      { path: "dashboard", Component: UserDashboardAr },
      { path: "inventory", Component: InventoryListAr },
      { path: "requests", Component: RequestsListAr },
      { path: "requests/create", Component: CreateRequestAr },
      { path: "requests/:id", Component: RequestDetailsAr },
      { path: "notifications", Component: NotificationsPageAr }
    ]
  },
  // Arabic Profile (shared layout)
  {
    path: "/ar/profile",
    Component: DashboardLayoutAr,
    children: [{ index: true, Component: ProfilePageAr }]
  },
  // Arabic 404 catch-all
  { path: "/ar/*", Component: NotFoundAr }
]);
export {
  router
};
