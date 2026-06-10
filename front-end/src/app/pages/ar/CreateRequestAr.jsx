import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Trash2, Send } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";
import { getStoredAssignedWarehouse } from "../../lib/warehouseDisplay";
const CreateRequestAr = () => {
  const navigate = useNavigate();
  const [supplierId, setSupplierId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const assignedWarehouse = getStoredAssignedWarehouse();
  const [items, setItems] = useState([
    { id: "1", product_id: "", quantity: "", unit_price: "" }
  ]);
  const { data: products, loading: productsLoading, error: productsError } = useApiResource(() => api.products.list(), []);
  const { data: suppliers, loading: suppliersLoading, error: suppliersError } = useApiResource(() => api.suppliers.list(), []);
  const addItem = () => {
    setItems((current) => [
      ...current,
      { id: Date.now().toString(), product_id: "", quantity: "", unit_price: "" }
    ]);
  };
  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };
  const updateItem = (id, field, value) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!assignedWarehouse.id) {
      setMessage("لم يتم تعيين مخزن لهذا المستخدم. يرجى التواصل مع المسؤول.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await api.orders.create({
        supplier_id: supplierId,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price || 0)
        }))
      });
      navigate("/ar/user/requests");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0637\u0644\u0628");
    } finally {
      setSaving(false);
    }
  };
  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr title="إنشاء طلب توريد" subtitle="اختيار أصناف غذائية من بيانات MongoDB وإرسالها للمراجعة" />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {message && <p className="text-sm text-[#D4183D] text-right">{message}</p>}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">معلومات الطلب</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
    options={[
      { value: "", label: suppliersLoading ? "\u062C\u0627\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646..." : suppliersError || "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0648\u0631\u062F" },
      ...suppliers.map((supplier) => ({ value: supplier._id, label: supplier.name }))
    ]}
    value={supplierId}
    onChange={(event) => setSupplierId(event.target.value)}
    disabled={suppliersLoading}
    required
  />
            <div>
              <p className="block mb-1.5 text-sm font-medium text-[#2E3A24] text-right">مخزن التسليم</p>
              <div className="rounded-xl border border-[#4E4631]/15 bg-[#ECEEE2]/60 px-4 py-2.5 text-sm text-[#2E3A24] text-right">
                {assignedWarehouse.name || "غير محدد"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4" />
              إضافة صنف
            </Button>
            <CardTitle className="text-right">الأصناف المطلوبة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {items.map((item, index) => <div key={item.id} className="p-4 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  {items.length > 1 && <button
    type="button"
    onClick={() => removeItem(item.id)}
    className="p-1.5 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors"
  >
                      <Trash2 className="w-4 h-4" />
                    </button>}
                  <p className="font-medium text-foreground text-right">الصنف {index + 1}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
    options={[
      { value: "", label: productsLoading ? "\u062C\u0627\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A..." : productsError || "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0646\u062A\u062C" },
      ...products.map((product) => ({
        value: product._id,
        label: `${product.name} (${product.quantity} ${product.unit})`
      }))
    ]}
    value={item.product_id}
    onChange={(event) => updateItem(item.id, "product_id", event.target.value)}
    disabled={productsLoading}
    required
  />
                  <Input
    label="الكمية *"
    type="number"
    min="1"
    value={item.quantity}
    onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
    required
    className="text-right"
  />
                  <Input
    label="سعر الوحدة *"
    type="number"
    min="0"
    value={item.unit_price}
    onChange={(event) => updateItem(item.id, "unit_price", event.target.value)}
    required
    className="text-right"
  />
                </div>
              </div>)}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/ar/user/requests")}>
            إلغاء
          </Button>
          <Button type="submit" disabled={saving}>
            <Send className="w-4 h-4" />
            {saving ? "\u062C\u0627\u0631 \u0627\u0644\u0625\u0631\u0633\u0627\u0644..." : "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628"}
          </Button>
        </div>
      </form>
    </div>;
};
export {
  CreateRequestAr
};
