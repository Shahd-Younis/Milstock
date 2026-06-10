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

const fieldValue = (value) => value || "غير محدد";

const ItemDetailsAr = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: products, loading, error } = useApiResource(() => api.products.list(), []);
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
  const status = getProductStatus(product);
  const statusVariant = {
    "in-stock": "success",
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
      title={product.name || "صنف مخزون"}
      subtitle={`${String(product._id || id).slice(-8).toUpperCase()} • ${product.category || "غير محدد"}`}
      actions={[
        { label: "\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0635\u0646\u0641", onClick: () => navigate(`/ar/admin/inventory/${id}/edit`), icon: Edit },
        { label: deleting ? "\u062c\u0627\u0631 \u0627\u0644\u062d\u0630\u0641..." : "\u062d\u0630\u0641", onClick: () => setShowDeleteConfirm(true), icon: Trash2, variant: "danger", disabled: deleting }
      ]}
    />
    {successMessage && <div className="rounded-xl border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 px-4 py-3 text-sm text-[#3d6b2e] text-right">{successMessage}</div>}
    {deleteError && <div className="rounded-xl border border-[#D4183D]/20 bg-[#D4183D]/10 px-4 py-3 text-sm text-[#D4183D] text-right">{deleteError}</div>}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card><div className="flex items-start gap-4 flex-row-reverse text-right"><Package className="w-8 h-8 text-[#6A7B4D]" /><div><p className="text-sm text-muted-foreground">الكمية الحالية</p><p className="text-3xl font-bold text-foreground">{product.quantity ?? 0}</p><p className="text-sm text-muted-foreground">{product.unit || ""}</p></div></div></Card>
      <Card><div className="flex items-start gap-4 flex-row-reverse text-right"><MapPin className="w-8 h-8 text-[#6A7B4D]" /><div><p className="text-sm text-muted-foreground">المخزن</p><p className="text-2xl font-bold text-foreground">{product.warehouse_id?.name || product.warehouse_name || "غير محدد"}</p><p className="text-sm text-muted-foreground">{product.storage_section || "لا يوجد قسم تخزين"}</p></div></div></Card>
      <Card><div className="flex items-start gap-4 flex-row-reverse text-right"><Calendar className="w-8 h-8 text-[#6A7B4D]" /><div><p className="text-sm text-muted-foreground">تاريخ انتهاء الصلاحية</p><p className="text-2xl font-bold text-foreground">{formatDate(expirationDate)}</p><Badge variant={statusVariant} className="mt-2">{status}</Badge></div></div></Card>
    </div>

    <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-right">تفاصيل الصنف</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right">
              {[
                ["الفئة", product.category],
                ["الوحدة", product.unit],
                ["الحد الأدنى للمخزون", product.min_quantity],
                ["تاريخ التصنيع", formatDate(product.manufacturing_date)],
                ["رقم التشغيلة", product.batch_number],
                ["الرقم التسلسلي", product.serial_number],
                ["موقع المخزن", product.warehouse_id?.location],
                ["قسم التخزين", product.storage_section]
              ].map(([label, value]) => <div key={label}>
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <p className="text-foreground font-medium">{fieldValue(value)}</p>
              </div>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-right">تفاصيل إضافية</CardTitle></CardHeader>
          <CardContent className="space-y-5 text-right">
            <div><p className="text-sm text-muted-foreground mb-2">الوصف</p><p className="text-foreground">{fieldValue(product.description)}</p></div>
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

