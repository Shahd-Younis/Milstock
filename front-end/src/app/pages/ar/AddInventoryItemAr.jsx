import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, X } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";

const unitOptions = [
  { value: "", label: "اختر وحدة القياس" },
  { value: "kg", label: "كجم" },
  { value: "g", label: "جرام" },
  { value: "liter", label: "لتر" },
  { value: "Tons", label: "طن" },
  { value: "piece", label: "قطعة" },
  { value: "box", label: "صندوق" }
];

const initialForm = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  min_quantity: "",
  warehouse_id: "",
  warehouse_name: "",
  storage_section: "",
  expiry_date: "",
  expiration_date: "",
  manufacturing_date: "",
  batch_number: "",
  serial_number: "",
  description: "",
  notes: ""
};

const AddInventoryItemAr = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: products, loading: productsLoading } = useApiResource(() => api.products.list(), []);
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useApiResource(() => api.warehouses.list(), []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [form, setForm] = useState(initialForm);

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return [
      { value: "", label: productsLoading ? "جار تحميل الفئات..." : "اختر الفئة" },
      ...categories.map((category) => ({ value: category, label: category }))
    ];
  }, [products, productsLoading]);

  useEffect(() => {
    if (!isEdit) return;
    const product = products.find((entry) => entry._id === id);
    if (!product) return;
    const expirationDate = product.expiration_date || product.expiry_date;
    setForm({
      name: product.name || "",
      category: product.category || "",
      quantity: String(product.quantity ?? ""),
      unit: product.unit || "",
      min_quantity: String(product.min_quantity ?? ""),
      warehouse_id: product.warehouse_id?._id || product.warehouse_id || "",
      warehouse_name: product.warehouse_name || product.warehouse_id?.name || "",
      storage_section: product.storage_section || "",
      expiry_date: expirationDate ? expirationDate.slice(0, 10) : "",
      expiration_date: expirationDate ? expirationDate.slice(0, 10) : "",
      manufacturing_date: product.manufacturing_date ? product.manufacturing_date.slice(0, 10) : "",
      batch_number: product.batch_number || "",
      serial_number: product.serial_number || "",
      description: product.description || "",
      notes: product.notes || ""
    });
  }, [id, isEdit, products]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    if (!form.warehouse_id) {
      setMessageType("error");
      setMessage("المخزن مطلوب.");
      setSaving(false);
      return;
    }

    const selectedWarehouse = warehouses.find((warehouse) => warehouse._id === form.warehouse_id);
    const payload = {
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      min_quantity: Number(form.min_quantity),
      warehouse_id: form.warehouse_id,
      warehouse_name: selectedWarehouse?.name || form.warehouse_name || "",
      storage_section: form.storage_section,
      expiry_date: form.expiration_date || form.expiry_date || undefined,
      expiration_date: form.expiration_date || form.expiry_date || undefined,
      manufacturing_date: form.manufacturing_date || undefined,
      batch_number: form.batch_number,
      serial_number: form.serial_number,
      description: form.description,
      notes: form.notes
    };

    try {
      if (isEdit && id) {
        await api.products.update(id, payload);
      } else {
        await api.products.create(payload);
      }
      setMessageType("success");
      setMessage(isEdit ? "تم تحديث الصنف بنجاح." : "تم إنشاء الصنف بنجاح.");
      window.setTimeout(() => navigate("/ar/admin/inventory"), 700);
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "تعذر حفظ الصنف");
    } finally {
      setSaving(false);
    }
  };

  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
    <PageHeaderAr
      title={isEdit ? "تعديل الصنف" : "إضافة صنف جديد"}
      subtitle={isEdit ? "تحديث بيانات صنف غذائي من MongoDB" : "إضافة صنف غذائي جديد إلى المخزون"}
    />

    <form onSubmit={handleSubmit} className="max-w-4xl">
      {message && <div className={`mb-4 rounded-xl px-4 py-3 text-sm text-right ${messageType === "success" ? "border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 text-[#3d6b2e]" : "border border-[#D4183D]/20 bg-[#D4183D]/10 text-[#D4183D]"}`}>{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input label="اسم الصنف *" value={form.name} onChange={handleChange("name")} required className="text-right" />
            <Select label="الفئة *" options={categoryOptions} value={form.category} onChange={handleChange("category")} required className="text-right" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="الكمية *" type="number" value={form.quantity} onChange={handleChange("quantity")} min="0" required className="text-right" />
              <Select label="الوحدة *" options={unitOptions} value={form.unit} onChange={handleChange("unit")} required className="text-right" />
            </div>
            <Input label="الحد الأدنى للمخزون *" type="number" value={form.min_quantity} onChange={handleChange("min_quantity")} min="0" required className="text-right" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">الموقع والتخزين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Select
              label="المخزن *"
              options={[
                { value: "", label: warehousesLoading ? "جار تحميل المخازن..." : warehousesError || "اختر المخزن..." },
                ...warehouses.map((warehouse) => ({
                  value: warehouse._id,
                  label: `${warehouse.name} - ${warehouse.location}`
                }))
              ]}
              value={form.warehouse_id}
              onChange={handleChange("warehouse_id")}
              disabled={warehousesLoading}
              required
              className="text-right"
            />
            <Input label="قسم التخزين" placeholder="مثال: B-12" value={form.storage_section} onChange={handleChange("storage_section")} className="text-right" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">انتهاء الصلاحية والتتبع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input label="تاريخ انتهاء الصلاحية" type="date" value={form.expiration_date || form.expiry_date} onChange={handleChange("expiration_date")} className="text-right" />
            <Input label="تاريخ التصنيع" type="date" value={form.manufacturing_date} onChange={handleChange("manufacturing_date")} className="text-right" />
            <Input label="رقم التشغيلة" value={form.batch_number} onChange={handleChange("batch_number")} className="text-right" />
            <Input label="الرقم التسلسلي" value={form.serial_number} onChange={handleChange("serial_number")} className="text-right" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">تفاصيل إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#2E3A24] text-right">الوصف</label>
              <textarea className="w-full min-h-28 px-4 py-2.5 rounded-xl bg-white border border-[#4E4631]/15 text-[#2E3A24] text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#6A7B4D]/30 focus:border-[#6A7B4D]" value={form.description} onChange={handleChange("description")} />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#2E3A24] text-right">ملاحظات</label>
              <textarea className="w-full min-h-28 px-4 py-2.5 rounded-xl bg-white border border-[#4E4631]/15 text-[#2E3A24] text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#6A7B4D]/30 focus:border-[#6A7B4D]" value={form.notes} onChange={handleChange("notes")} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/ar/admin/inventory")}>
          <X className="w-4 h-4" />
          إلغاء
        </Button>
        <Button type="submit" disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? "جار الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة الصنف"}
        </Button>
      </div>
    </form>
  </div>;
};

export {
  AddInventoryItemAr
};
