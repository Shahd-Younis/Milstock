import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, Plus } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { ExportCsvButton } from "../../components/ExportCsvButton";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";
import { formatDate } from "../../lib/format";
import { normalizeArray, sameId } from "../../lib/normalize";

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

  const orderItemsArray = normalizeArray(orderItems);
  const requestRows = orders.map((order) => {
    const items = orderItemsArray.filter((item) => sameId(item.order_id, order._id));
    return {
      id: order._id.slice(-8).toUpperCase(),
      mongoId: order._id,
      kitchen: order.user_id?.name || order.user_id?.military_number || "مستخدم",
      item: items.map((item) => item.product_id?.name || item.product?.name || item.product_name || item.name).filter(Boolean).join(", ") || "طلب توريد",
      quantity: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      status: order.status,
      requestedDate: formatDate(order.date),
      requestedBy: order.user_id?.name || "غير محدد",
      supplier: order.supplier_id?.name || "غير محدد"
    };
  });

  const filtered = requestRows.filter((request) => {
    const search = String(searchTerm ?? "").toLowerCase();
    const matchSearch =
      String(request.id ?? "").toLowerCase().includes(search) ||
      String(request.kitchen ?? "").toLowerCase().includes(search) ||
      String(request.item ?? "").toLowerCase().includes(search) ||
      String(request.supplier ?? "").toLowerCase().includes(search);
    const matchStatus = statusFilter === "all" || request.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const exportColumns = [
    { key: "id", header: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628" },
    { key: "kitchen", header: "\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645" },
    { key: "item", header: "\u0627\u0644\u0623\u0635\u0646\u0627\u0641" },
    { key: "quantity", header: "\u0627\u0644\u0643\u0645\u064a\u0629" },
    { key: "supplier", header: "\u0627\u0644\u0645\u0648\u0631\u062f" },
    { header: "\u0627\u0644\u062d\u0627\u0644\u0629", value: (row) => statusLabels[row.status] || row.status },
    { key: "requestedDate", header: "\u0627\u0644\u062a\u0627\u0631\u064a\u062e" },
    { key: "requestedBy", header: "\u0645\u0642\u062f\u0645 \u0627\u0644\u0637\u0644\u0628" }
  ];

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
      <ExportCsvButton filenamePrefix="requests-export" columns={exportColumns} rows={ordersLoading ? [] : filtered} className="flex items-center gap-2">
        {"\u062a\u0635\u062f\u064a\u0631"}
      </ExportCsvButton>
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

