import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowRight, Calendar, Edit, MapPin, Package, Trash2 } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";
import { formatDate, getProductStatus } from "../../lib/format";
import { getLocalizedValue, localizeText } from "../../lib/localization";

const fieldValue = (value) => value || "غير محدد";

const ItemDetailsAr = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: products, loading, error } = useApiResource(() => api.products.list(), []);
  const { data: productWarehouseRows } = useApiResource(() => api.productWarehouses.list(), []);
  const product = useMemo(() => products.find((entry) => entry._id === id), [id, products]);

  if (loading) {
    return <div dir="rtl" className="p-6 lg:p-8"><Card><CardContent className="py-10 text-center text-muted-foreground">جار تحميل الصنف من MongoDB...</CardContent></Card></div>;
  }

  if (error || !product) {
    return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
      <button onClick={() => navigate("/ar/admin/inventory")} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm">
        <ArrowRight className="w-4 h-4" />
        العودة إلى المخزون
      </button>
      <Card><CardContent className="py-10 text-center text-muted-foreground">{error || "الصنف غير موجود."}</CardContent></Card>
    </div>;
  }

  const expirationDate = product.expiration_date || product.expiry_date;
  const productName = getLocalizedValue(product, "name", "ar") || "صنف مخزون";
  const productCategory = getLocalizedValue(product, "category", "ar");
  const productDescription = getLocalizedValue(product, "description", "ar");
  const normalizeIdentity = (value) => String(value || "").trim().toLowerCase();
  const sameItemProducts = products.filter((entry) =>
    normalizeIdentity(entry.name) === normalizeIdentity(product.name)
    && normalizeIdentity(entry.unit) === normalizeIdentity(product.unit)
    && normalizeIdentity(entry.category) === normalizeIdentity(product.category)
  );
  const sameItemProductIds = new Set(sameItemProducts.map((entry) => String(entry._id)));
  const mergeWarehouseRows = (rows) => {
    const byWarehouse = new Map();
    rows.forEach((warehouse) => {
      const key = String(warehouse.id || warehouse._id || warehouse.name || "");
      const existing = byWarehouse.get(key);
      if (existing) {
        existing.quantity += Number(warehouse.quantity || 0);
      } else {
        byWarehouse.set(key, { ...warehouse, quantity: Number(warehouse.quantity || 0) });
      }
    });
    return Array.from(byWarehouse.values());
  };
  const rowWarehouseStock = mergeWarehouseRows(productWarehouseRows
    .filter((row) => sameItemProductIds.has(String(row.product_id?._id || row.product_id || "")))
    .map((row) => {
      const rowProduct = row.product_id && typeof row.product_id === "object" ? row.product_id : sameItemProducts.find((entry) => entry._id === (row.product_id?._id || row.product_id));
      return {
        id: row.warehouse_id?._id || row.warehouse_id,
        _id: row.warehouse_id?._id || row.warehouse_id,
        name: getLocalizedValue(row.warehouse_id, "name", "ar") || getLocalizedValue(rowProduct?.warehouse_id, "name", "ar") || localizeText(rowProduct?.warehouse_name, "ar") || "غير محدد",
        code: row.warehouse_id?.code || rowProduct?.warehouse_id?.code || "",
        location: getLocalizedValue(row.warehouse_id, "location", "ar") || getLocalizedValue(rowProduct?.warehouse_id, "location", "ar") || "",
        quantity: Number(row.quantity || 0),
        unit: rowProduct?.unit || product.unit,
      };
    }));
  const sameItemProductStock = mergeWarehouseRows(sameItemProducts
    .filter((entry) => entry.warehouse_id || entry.warehouse_name)
    .map((entry) => ({
      id: entry.warehouse_id?._id || entry.warehouse_id || entry.warehouse_name,
      _id: entry.warehouse_id?._id || entry.warehouse_id,
      name: getLocalizedValue(entry.warehouse_id, "name", "ar") || localizeText(entry.warehouse_name, "ar") || "غير محدد",
      code: entry.warehouse_id?.code || "",
      location: getLocalizedValue(entry.warehouse_id, "location", "ar") || "",
      quantity: Number(entry.quantity || 0),
      unit: entry.unit,
    })));
  const hasWarehouseArray = Array.isArray(product.warehouses);
  const warehouseStock = rowWarehouseStock.length
    ? rowWarehouseStock
    : sameItemProductStock.length
    ? sameItemProductStock
    : hasWarehouseArray
    ? product.warehouses
    : (product.warehouse_id || product.warehouse_name ? [{
      id: product.warehouse_id?._id || product.warehouse_id || "legacy-warehouse",
      name: getLocalizedValue(product.warehouse_id, "name", "ar") || localizeText(product.warehouse_name, "ar") || "غير محدد",
      code: product.warehouse_id?.code,
      location: getLocalizedValue(product.warehouse_id, "location", "ar"),
      quantity: product.quantity ?? 0,
      unit: product.unit,
    }] : []);
  const totalStock = warehouseStock.length
    ? warehouseStock.reduce((sum, warehouse) => sum + Number(warehouse.quantity || 0), 0)
    : Number(product.totalStock ?? product.quantity ?? 0);
  const primaryWarehouse = warehouseStock[0] || {
    name: getLocalizedValue(product.warehouse_id, "name", "ar") || localizeText(product.warehouse_name, "ar") || "غير محدد",
    code: product.warehouse_id?.code,
    location: getLocalizedValue(product.warehouse_id, "location", "ar"),
    quantity: product.quantity ?? 0,
    unit: product.unit,
  };
  const status = getProductStatus(product);
  const statusVariant = {
    "in-stock": "success",
    critical: "danger",
    "low-stock": "warning",
    "out-of-stock": "danger",
    "expiring-soon": "warning"
  }[status] || "neutral";
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await api.products.remove(id);
      setSuccessMessage("\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0635\u0646\u0641 \u0628\u0646\u062c\u0627\u062d.");
      window.setTimeout(() => navigate("/ar/admin/inventory"), 500);
    } catch (requestError) {
      setDeleteError(requestError.message || "\u062a\u0639\u0630\u0631 \u062d\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0635\u0646\u0641.");
      setDeleting(false);
    }
  };

  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
    <button onClick={() => navigate("/ar/admin/inventory")} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm">
      <ArrowRight className="w-4 h-4" />
      العودة إلى المخزون
    </button>

    <PageHeaderAr
      title={productName}
      subtitle={`${String(product._id || id).slice(-8).toUpperCase()} • ${productCategory || "غير محدد"}`}
      actions={[
        { label: "\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0635\u0646\u0641", onClick: () => navigate(`/ar/admin/inventory/${id}/edit`), icon: Edit },
        { label: deleting ? "\u062c\u0627\u0631 \u0627\u0644\u062d\u0630\u0641..." : "\u062d\u0630\u0641", onClick: () => setShowDeleteConfirm(true), icon: Trash2, variant: "danger", disabled: deleting }
      ]}
    />
    {successMessage && <div className="rounded-xl border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 px-4 py-3 text-sm text-[#3d6b2e] text-right">{successMessage}</div>}
    {deleteError && <div className="rounded-xl border border-[#D4183D]/20 bg-[#D4183D]/10 px-4 py-3 text-sm text-[#D4183D] text-right">{deleteError}</div>}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card><div className="flex items-start gap-4 flex-row-reverse text-right"><Package className="w-8 h-8 text-[#6A7B4D]" /><div><p className="text-sm text-muted-foreground">الكمية الحالية</p><p className="text-3xl font-bold text-foreground">{totalStock}</p><p className="text-sm text-muted-foreground">{product.unit || ""}</p></div></div></Card>
      <Card><div className="flex items-start gap-4 flex-row-reverse text-right"><MapPin className="w-8 h-8 text-[#6A7B4D]" /><div><p className="text-sm text-muted-foreground">المخزن</p><p className="text-2xl font-bold text-foreground">{warehouseStock.length > 1 ? `${warehouseStock.length} مخازن` : primaryWarehouse.name}</p><p className="text-sm text-muted-foreground">{warehouseStock.length > 1 ? "راجع توزيع المخزون بالأسفل" : primaryWarehouse.location || product.storage_section || "لا يوجد قسم تخزين"}</p></div></div></Card>
      <Card><div className="flex items-start gap-4 flex-row-reverse text-right"><Calendar className="w-8 h-8 text-[#6A7B4D]" /><div><p className="text-sm text-muted-foreground">تاريخ انتهاء الصلاحية</p><p className="text-2xl font-bold text-foreground">{formatDate(expirationDate)}</p><Badge variant={statusVariant} className="mt-2">{status}</Badge></div></div></Card>
    </div>

    <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-right">تفاصيل الصنف</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right">
              {[
                ["الفئة", productCategory],
                ["الوحدة", product.unit],
                ["حد انخفاض المخزون", product.alert_settings?.low_stock_threshold ?? product.min_quantity],
                ["حد المخزون الحرج", product.alert_settings?.critical_stock_threshold ?? 0],
                ["تاريخ التصنيع", formatDate(product.manufacturing_date)],
                ["رقم التشغيلة", product.batch_number],
                ["الرقم التسلسلي", product.serial_number],
                ["موقع المخزن", warehouseStock.length > 1 ? `${warehouseStock.length} مواقع مخازن` : primaryWarehouse.location],
                ["قسم التخزين", product.storage_section]
              ].map(([label, value]) => <div key={label}>
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <p className="text-foreground font-medium">{fieldValue(value)}</p>
              </div>)}
            </div>
          </CardContent>
        </Card>

        {(warehouseStock.length !== 1) && <Card>
          <CardHeader><CardTitle className="text-right">المخزون حسب المخزن</CardTitle></CardHeader>
          <CardContent>
            {warehouseStock.length === 0 ? <div className="rounded-xl border border-[#4E4631]/10 bg-[#ECEEE2]/50 px-4 py-6 text-center text-sm text-[#5A6B50]">
              لا توجد كميات مخزنة لهذا الصنف في أي مخزن
            </div> : <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-[#4E4631]/10 text-[#5A6B50]">
                    <th className="py-2 pl-3">المخزن</th>
                    <th className="py-2 pl-3">الكود / الموقع</th>
                    <th className="py-2 pl-3">كمية المخزون</th>
                    <th className="py-2 pl-3">الوحدة</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseStock.map((warehouse) => <tr key={warehouse.id || warehouse._id || warehouse.name} className="border-b border-[#4E4631]/5">
                    <td className="py-2 pl-3 font-medium text-[#2E3A24]">{warehouse.name || "مخزن بدون اسم"}</td>
                    <td className="py-2 pl-3 text-[#5A6B50]">
                      {[warehouse.code, warehouse.location].filter(Boolean).join(" / ") || "غير محدد"}
                    </td>
                    <td className="py-2 pl-3 font-semibold text-[#2E3A24]">{warehouse.quantity ?? 0}</td>
                    <td className="py-2 pl-3">{warehouse.unit || product.unit || "غير محدد"}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>}
          </CardContent>
        </Card>}

        <Card>
          <CardHeader><CardTitle className="text-right">تفاصيل إضافية</CardTitle></CardHeader>
          <CardContent className="space-y-5 text-right">
            <div><p className="text-sm text-muted-foreground mb-2">الوصف</p><p className="text-foreground">{fieldValue(productDescription)}</p></div>
            <div><p className="text-sm text-muted-foreground mb-2">ملاحظات</p><p className="text-foreground">{fieldValue(product.notes)}</p></div>
          </CardContent>
        </Card>
    </div>

    {showDeleteConfirm && <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#4E4631]/10 shadow-xl p-6 text-right">
        <h3 className="text-[#2E3A24] font-semibold mb-2">{"\u062d\u0630\u0641 \u0627\u0644\u0635\u0646\u0641"}</h3>
        <p className="text-sm text-[#5A6B50] mb-5">{"\u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f \u0623\u0646\u0643 \u062a\u0631\u064a\u062f \u062d\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0635\u0646\u0641\u061f"}</p>
        {deleteError && <p className="mb-4 rounded-lg border border-[#D4183D]/20 bg-[#D4183D]/10 px-3 py-2 text-sm text-[#D4183D]">{deleteError}</p>}
        <div className="flex flex-col sm:flex-row justify-start gap-3">
          <Button variant="outline" type="button" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>{"\u0625\u0644\u063a\u0627\u0621"}</Button>
          <Button variant="danger" type="button" onClick={handleDelete} disabled={deleting}>{deleting ? "\u062c\u0627\u0631 \u0627\u0644\u062d\u0630\u0641..." : "\u062d\u0630\u0641"}</Button>
        </div>
      </div>
    </div>}
  </div>;
};

export {
  ItemDetailsAr
};

