import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, Filter, Plus } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";
import { formatDate } from "../../lib/format";

const statusLabels = {
  pending: "قيد المراجعة",
  approved: "موافق عليه",
  completed: "مكتمل",
  cancelled: "ملغي",
  rejected: "مرفوض",
  delivered: "تم التسليم"
};

const statusVariants = {
  pending: "pending",
  approved: "success",
  completed: "info",
  delivered: "info",
  cancelled: "danger",
  rejected: "danger"
};

const RequestsListAr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/ar/admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: orders, loading: ordersLoading, error: ordersError } = useApiResource(() => api.orders.list(), []);
  const { data: orderItems } = useApiResource(() => api.orderItems.list(), []);

  const requestRows = orders.map((order) => {
    const items = orderItems.filter((item) => item.order_id?._id === order._id || item.order_id === order._id);
    return {
      id: order._id.slice(-8).toUpperCase(),
      mongoId: order._id,
      kitchen: order.user_id?.name || order.user_id?.military_number || "مستخدم",
      item: items.map((item) => item.product_id?.name).filter(Boolean).join(", ") || "طلب توريد",
      quantity: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      status: order.status,
      requestedDate: formatDate(order.date),
      requestedBy: order.user_id?.name || "غير محدد",
      supplier: order.supplier_id?.name || "غير محدد"
    };
  });

  const filtered = requestRows.filter((request) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      request.id.toLowerCase().includes(search) ||
      request.kitchen.toLowerCase().includes(search) ||
      request.item.toLowerCase().includes(search) ||
      request.supplier.toLowerCase().includes(search);
    const matchStatus = statusFilter === "all" || request.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
    <PageHeaderAr
      title={isAdmin ? "جميع طلبات التوريد" : "طلباتي"}
      subtitle="نفس طلبات MongoDB المستخدمة في الواجهة الإنجليزية"
      action={!isAdmin ? {
        label: "طلب جديد",
        onClick: () => navigate("/ar/user/requests/create"),
        icon: Plus
      } : void 0}
    />

    <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="ابحث برقم الطلب، المستخدم، الصنف أو المورد..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pr-12 text-right"
          />
        </div>
        <Select
          options={[
            { value: "all", label: "جميع الحالات" },
            { value: "pending", label: "قيد المراجعة" },
            { value: "approved", label: "موافق عليه" },
            { value: "completed", label: "مكتمل" },
            { value: "cancelled", label: "ملغي" }
          ]}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        />
      </div>
    </div>

    <div className="mb-4 flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        {ordersLoading ? "جاري تحميل الطلبات من MongoDB..." : ordersError || `عرض ${filtered.length} من ${requestRows.length} طلب`}
      </p>
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        فلاتر إضافية
      </Button>
    </div>

    <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
      <table className="w-full text-right">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            {["رقم الطلب", "المستخدم", "الأصناف", "الكمية", "المورد", "الحالة", "التاريخ", "مقدم الطلب"].map((header) => <th key={header} className="px-4 py-3 text-sm font-medium text-muted-foreground">{header}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map((request) => <tr
            key={request.mongoId}
            className="hover:bg-muted/20 transition-colors cursor-pointer"
            onClick={() => navigate(isAdmin ? `/ar/admin/requests/${request.mongoId}` : `/ar/user/requests/${request.mongoId}`)}
          >
            <td className="px-4 py-3 font-mono text-sm font-medium text-foreground">{request.id}</td>
            <td className="px-4 py-3 text-foreground">{request.kitchen}</td>
            <td className="px-4 py-3 text-foreground">{request.item}</td>
            <td className="px-4 py-3 text-foreground">{request.quantity}</td>
            <td className="px-4 py-3 text-foreground">{request.supplier}</td>
            <td className="px-4 py-3"><Badge variant={statusVariants[request.status] || "neutral"}>{statusLabels[request.status] || request.status}</Badge></td>
            <td className="px-4 py-3 text-muted-foreground">{request.requestedDate}</td>
            <td className="px-4 py-3 text-foreground">{request.requestedBy}</td>
          </tr>)}
        </tbody>
      </table>
    </div>

    <div className="lg:hidden space-y-3">
      {filtered.map((request) => <div
        key={request.mongoId}
        className="p-4 rounded-xl border border-border bg-card cursor-pointer hover:border-primary transition-colors"
        onClick={() => navigate(isAdmin ? `/ar/admin/requests/${request.mongoId}` : `/ar/user/requests/${request.mongoId}`)}
      >
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusVariants[request.status] || "neutral"}>{statusLabels[request.status] || request.status}</Badge>
          <div className="text-right">
            <p className="font-semibold text-foreground">{request.id}</p>
            <p className="text-xs text-muted-foreground">{request.kitchen}</p>
          </div>
        </div>
        <p className="text-sm text-foreground text-right mb-2">{request.item} - الكمية: {request.quantity}</p>
        <p className="text-xs text-muted-foreground text-right">{request.requestedDate} - {request.supplier}</p>
      </div>)}
    </div>
  </div>;
};

export {
  RequestsListAr
};
