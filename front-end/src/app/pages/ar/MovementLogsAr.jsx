import { useMemo, useState } from "react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { ExportCsvButton } from "../../components/ExportCsvButton";
import { CheckCircle, Search } from "lucide-react";
import { useLocation } from "react-router";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";
import { formatDate } from "../../lib/format";

const actionLabels = {
  in: "وارد",
  out: "صادر",
  transfer: "نقل",
  consumption: "استهلاك",
  consumption_cancelled: "إلغاء استهلاك"
};

const actionVariants = {
  in: "success",
  out: "danger",
  transfer: "info",
  consumption: "warning",
  consumption_cancelled: "success"
};

const MovementLogsAr = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [busyOrderId, setBusyOrderId] = useState("");
  const [message, setMessage] = useState("");
  const { data: movements, loading, error } = useApiResource(() => api.movements.list(), []);
  const { data: productWarehouses } = useApiResource(() => api.productWarehouses.list(), []);
  const query = new URLSearchParams(location.search);
  const warehouseFilter = query.get("warehouse_id");
  const statusQueryFilter = query.get("status");
  const matchesWarehouseFilter = (movement) => {
    if (!warehouseFilter) return true;
    return [
      movement.from_warehouse?._id || movement.from_warehouse,
      movement.to_warehouse?._id || movement.to_warehouse,
      movement.reference_id?._id || movement.reference_id
    ].some((warehouseId) => String(warehouseId || "") === String(warehouseFilter));
  };

  const pendingTransfers = useMemo(() => {
    const pendingRows = movements.filter((movement) => matchesWarehouseFilter(movement) && movement.movement_type === "warehouse_transfer" && movement.status === "pending" && movement.order_id);
    const byOrder = new Map();

    pendingRows.forEach((movement) => {
      const orderId = movement.order_id?._id || movement.order_id;
      if (!byOrder.has(orderId)) {
        byOrder.set(orderId, {
          orderId,
          requestId: String(orderId).slice(-8).toUpperCase(),
          requester: movement.requested_by?.name || movement.user_id?.name || "غير معروف",
          approvedAt: movement.approved_at || movement.createdAt,
          source: movement.from_warehouse?.name || movement.reference_id?.name || "المخزن المصدر",
          destination: movement.to_warehouse?.name || "المخزن المستلم",
          rows: []
        });
      }

      const productId = movement.product_id?._id || movement.product_id;
      const sourceWarehouseId = movement.from_warehouse?._id || movement.from_warehouse;
      const destinationWarehouseId = movement.to_warehouse?._id || movement.to_warehouse;
      const sourceStock = productWarehouses.find((row) => (row.product_id?._id || row.product_id) === productId && (row.warehouse_id?._id || row.warehouse_id) === sourceWarehouseId);
      const destinationStock = productWarehouses.find((row) => (row.product_id?._id || row.product_id) === productId && (row.warehouse_id?._id || row.warehouse_id) === destinationWarehouseId);

      byOrder.get(orderId).rows.push({
        movementId: movement._id,
        productName: movement.product_id?.name || "صنف غير معروف",
        quantity: movement.requested_quantity || movement.stock,
        sourceStock: sourceStock?.quantity ?? 0,
        destinationStock: destinationStock?.quantity ?? 0
      });
    });

    return Array.from(byOrder.values());
  }, [movements, productWarehouses, warehouseFilter]);

  const movementData = movements.filter((movement) => matchesWarehouseFilter(movement) && movement.status !== "pending").map((movement) => ({
    id: movement._id.slice(-8).toUpperCase(),
    date: formatDate(movement.createdAt),
    itemId: movement.product_id?._id?.slice(-8).toUpperCase() || "N/A",
    itemName: movement.product_id?.name || "صنف غير معروف",
    action: movement.movement_type === "consumption" || movement.movement_type === "consumption_cancelled" ? movement.movement_type : movement.change_type,
    status: movement.status,
    quantity: `${movement.change_type === "in" ? "+" : movement.change_type === "out" ? "-" : ""}${movement.stock}`,
    source: movement.from_warehouse?.name || movement.to_warehouse?.name || movement.reference_id?.name || "غير محدد",
    destination: movement.to_warehouse?.name || "غير محدد",
    user: movement.performed_by?.name || movement.completed_by?.name || movement.user_id?.name || "غير معروف",
    reason: movement.reference_type || "حركة مخزون"
  }));

  const filteredData = movementData.filter((movement) => {
    const search = String(searchTerm ?? "").toLowerCase();
    const matchesSearch = String(movement.id ?? "").toLowerCase().includes(search) || String(movement.itemName ?? "").toLowerCase().includes(search) || String(movement.itemId ?? "").toLowerCase().includes(search);
    const matchesAction = actionFilter === "all" || movement.action === actionFilter;
    const matchesStatus = !statusQueryFilter || movement.status === statusQueryFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const completeMovement = async (orderId) => {
    setBusyOrderId(orderId);
    setMessage("");
    try {
      await api.movements.completeTransfer(orderId, "تم إتمام النقل من سجلات الحركة");
      setMessage("تم إتمام النقل بنجاح. سيتم تحديث الصفحة لعرض سجل الحركة.");
      window.setTimeout(() => window.location.reload(), 500);
    } catch (requestError) {
      setMessage(requestError.message || "تعذر إتمام النقل.");
    } finally {
      setBusyOrderId("");
    }
  };

  const exportColumns = [
    { key: "id", header: "رقم الحركة" },
    { key: "date", header: "التاريخ" },
    { key: "itemId", header: "رمز الصنف" },
    { key: "itemName", header: "الصنف" },
    { header: "النوع", value: (row) => actionLabels[row.action] || row.action },
    { key: "quantity", header: "الكمية" },
    { key: "source", header: "المخزن المصدر" },
    { key: "destination", header: "المخزن المستلم" },
    { key: "user", header: "منفذ بواسطة" },
    { key: "reason", header: "المرجع" }
  ];

  return <div className="p-6 lg:p-8 space-y-6" dir="rtl">
      <PageHeaderAr title="سجلات الحركة" subtitle="إتمام التحويلات المعلقة ومراجعة سجل حركات المخزون" />

      {message && <div className="rounded-xl border border-[#4E4631]/10 bg-white px-4 py-3 text-sm text-[#2E3A24]">{message}</div>}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant={activeTab === "pending" ? "primary" : "outline"} onClick={() => setActiveTab("pending")}>التحويلات المعلقة</Button>
        <Button type="button" variant={activeTab === "history" ? "primary" : "outline"} onClick={() => setActiveTab("history")}>سجل الحركات</Button>
      </div>

      {activeTab === "pending" && <div className="space-y-4">
        {loading && <p className="text-sm text-[#5A6B50]">جاري تحميل التحويلات المعلقة...</p>}
        {!loading && pendingTransfers.length === 0 && <div className="rounded-xl border border-[#4E4631]/10 bg-white p-6 text-sm text-[#5A6B50]">لا توجد تحويلات معلقة بانتظار الإتمام.</div>}
        {pendingTransfers.map((transfer) => <div key={transfer.orderId} className="rounded-2xl border border-[#4E4631]/10 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="text-right">
                <p className="text-xs text-[#5A6B50]">رقم الطلب</p>
                <h3 className="font-semibold text-[#2E3A24]">{transfer.requestId}</h3>
                <p className="text-sm text-[#5A6B50]">{transfer.source} ← {transfer.destination}</p>
                <p className="text-xs text-[#5A6B50]">مقدم الطلب: {transfer.requester} | تاريخ الموافقة: {formatDate(transfer.approvedAt)}</p>
              </div>
              <Button type="button" onClick={() => completeMovement(transfer.orderId)} disabled={busyOrderId === transfer.orderId}>
                <CheckCircle className="w-4 h-4" />
                {busyOrderId === transfer.orderId ? "جاري الإتمام..." : "إتمام النقل"}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-[#4E4631]/10 text-[#5A6B50]">
                    <th className="py-2 pl-3">الصنف</th>
                    <th className="py-2 pl-3">الكمية المطلوبة</th>
                    <th className="py-2 pl-3">الكمية الحالية في المخزن المصدر</th>
                    <th className="py-2 pl-3">الكمية الحالية في المخزن المستلم</th>
                  </tr>
                </thead>
                <tbody>
                  {transfer.rows.map((row) => <tr key={row.movementId} className="border-b border-[#4E4631]/5">
                      <td className="py-2 pl-3 font-medium text-[#2E3A24]">{row.productName}</td>
                      <td className="py-2 pl-3">{row.quantity}</td>
                      <td className="py-2 pl-3">{row.sourceStock}</td>
                      <td className="py-2 pl-3">{row.destinationStock}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>)}
      </div>}

      {activeTab === "history" && <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="ابحث برقم الحركة أو اسم الصنف..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-12 text-right" />
            </div>
          </div>
          <Select
            options={[
              { value: "all", label: "كل الحركات" },
              { value: "in", label: "وارد" },
              { value: "out", label: "صادر" },
              { value: "transfer", label: "نقل" },
              { value: "consumption", label: "استهلاك" },
              { value: "consumption_cancelled", label: "إلغاء استهلاك" }
            ]}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          />
          <Input type="date" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading ? "جاري تحميل سجلات الحركة..." : error || `عرض ${filteredData.length} من ${movementData.length} حركة`}
          </p>
          <ExportCsvButton filenamePrefix="movement-logs-export" columns={exportColumns} rows={loading ? [] : filteredData}>
            تصدير السجل
          </ExportCsvButton>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {["رقم الحركة", "التاريخ", "الصنف", "النوع", "الكمية", "المخزن المصدر", "المخزن المستلم", "منفذ بواسطة", "المرجع"].map((heading) => <th key={heading} className="px-4 py-3 text-sm font-medium text-muted-foreground">{heading}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(loading ? [] : filteredData).map((movement) => <tr key={movement.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm font-medium">{movement.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{movement.date}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{movement.itemName}</p>
                    <p className="text-xs text-muted-foreground">{movement.itemId}</p>
                  </td>
                  <td className="px-4 py-3"><Badge variant={actionVariants[movement.action] || "default"}>{actionLabels[movement.action] || movement.action}</Badge></td>
                  <td className="px-4 py-3 font-semibold">{movement.quantity}</td>
                  <td className="px-4 py-3 text-muted-foreground">{movement.source}</td>
                  <td className="px-4 py-3 text-muted-foreground">{movement.destination}</td>
                  <td className="px-4 py-3">{movement.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{movement.reason}</td>
                </tr>)}
            </tbody>
          </table>
          {!loading && filteredData.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">{error || "لا توجد حركات مطابقة."}</p>}
        </div>
      </>}
    </div>;
};

export {
  MovementLogsAr
};
