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
  { value: "", label: "\u0627\u062E\u062A\u0631 \u0648\u062D\u062F\u0629 \u0627\u0644\u0642\u064A\u0627\u0633" },
  { value: "kg", label: "\u0643\u063A\u0645" },
  { value: "g", label: "\u063A\u0631\u0627\u0645" },
  { value: "liter", label: "\u0644\u062A\u0631" },
  { value: "piece", label: "\u0642\u0637\u0639\u0629" },
  { value: "box", label: "\u0635\u0646\u062F\u0648\u0642" }
];
const AddInventoryItemAr = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: products, loading: productsLoading } = useApiResource(() => api.products.list(), []);
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useApiResource(() => api.warehouses.list(), []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    min_quantity: "",
    warehouse_id: "",
    expiry_date: ""
  });
  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return [
      { value: "", label: productsLoading ? "\u062C\u0627\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0641\u0626\u0627\u062A..." : "\u0627\u062E\u062A\u0631 \u0627\u0644\u0641\u0626\u0629" },
      ...categories.map((category) => ({ value: category, label: category }))
    ];
  }, [products, productsLoading]);
  useEffect(() => {
    if (!isEdit) return;
    const product = products.find((entry) => entry._id === id);
    if (!product) return;
    setForm({
      name: product.name,
      category: product.category,
      quantity: String(product.quantity),
      unit: product.unit,
      min_quantity: String(product.min_quantity),
      warehouse_id: product.warehouse_id?._id || "",
      expiry_date: product.expiry_date ? product.expiry_date.slice(0, 10) : ""
    });
  }, [id, isEdit, products]);
  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = {
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      min_quantity: Number(form.min_quantity),
      warehouse_id: form.warehouse_id,
      expiry_date: form.expiry_date || void 0
    };
    try {
      if (isEdit && id) {
        await api.products.update(id, payload);
      } else {
        await api.products.create(payload);
      }
      navigate("/ar/admin/inventory");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0627\u0644\u0635\u0646\u0641");
    } finally {
      setSaving(false);
    }
  };
  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
    title={isEdit ? "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0635\u0646\u0641" : "\u0625\u0636\u0627\u0641\u0629 \u0635\u0646\u0641 \u062C\u062F\u064A\u062F"}
    subtitle={isEdit ? "\u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0635\u0646\u0641 \u063A\u0630\u0627\u0626\u064A \u0645\u0646 MongoDB" : "\u0625\u0636\u0627\u0641\u0629 \u0635\u0646\u0641 \u063A\u0630\u0627\u0626\u064A \u062C\u062F\u064A\u062F \u0625\u0644\u0649 \u0627\u0644\u0645\u062E\u0632\u0648\u0646"}
  />

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {message && <p className="mb-4 text-sm text-[#D4183D] text-right">{message}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Input label="اسم الصنف *" value={form.name} onChange={handleChange("name")} required className="text-right" />
              <Select options={categoryOptions} value={form.category} onChange={handleChange("category")} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="الكمية *" type="number" value={form.quantity} onChange={handleChange("quantity")} required className="text-right" />
                <Select options={unitOptions} value={form.unit} onChange={handleChange("unit")} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-right">المخزون والموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Input label="الحد الأدنى *" type="number" value={form.min_quantity} onChange={handleChange("min_quantity")} required className="text-right" />
              <Input label="تاريخ الصلاحية" type="date" value={form.expiry_date} onChange={handleChange("expiry_date")} className="text-right" />
              <Select
    options={[
      { value: "", label: warehousesLoading ? "\u062C\u0627\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A..." : warehousesError || "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639" },
      ...warehouses.map((warehouse) => ({
        value: warehouse._id,
        label: `${warehouse.name} - ${warehouse.location}`
      }))
    ]}
    value={form.warehouse_id}
    onChange={handleChange("warehouse_id")}
    disabled={warehousesLoading}
    required
  />
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
            {saving ? "\u062C\u0627\u0631 \u0627\u0644\u062D\u0641\u0638..." : isEdit ? "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A" : "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0635\u0646\u0641"}
          </Button>
        </div>
      </form>
    </div>;
};
export {
  AddInventoryItemAr
};
