import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Save } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
import { getStoredAuth } from "../lib/auth";
import { getLocalizedValue } from "../lib/localization";

const labelsEn = {
  title: "Record Consumption",
  subtitle: "Decrease warehouse stock for items used or consumed",
  warehouse: "Warehouse",
  product: "Product",
  available: "Available Quantity",
  unit: "Unit",
  quantity: "Consumed Quantity",
  reason: "Reason",
  department: "Department",
  notes: "Notes",
  selectWarehouse: "Select warehouse...",
  selectProduct: "Select product...",
  save: "Save Consumption",
  saving: "Saving...",
  assignedMissing: "No warehouse assigned to this user. Please contact admin.",
  required: "This field is required",
  invalidQuantity: "Consumed quantity must be greater than zero and not exceed available stock",
  success: "Consumption recorded successfully.",
  reasons: {
    daily: "Daily usage",
    damaged: "Damaged",
    expired: "Expired disposal",
    operational: "Operational use",
    other: "Other",
  }
};

const labelsAr = {
  title: "تسجيل استهلاك",
  subtitle: "خصم الكميات المستخدمة أو المستهلكة من المخزون",
  warehouse: "المخزن",
  product: "المنتج",
  available: "الكمية المتاحة",
  unit: "الوحدة",
  quantity: "الكمية المستهلكة",
  reason: "السبب",
  department: "القسم",
  notes: "ملاحظات",
  selectWarehouse: "اختر المخزن...",
  selectProduct: "اختر المنتج...",
  save: "حفظ الاستهلاك",
  saving: "جاري الحفظ...",
  assignedMissing: "لم يتم تعيين مخزن لهذا المستخدم. يرجى التواصل مع المسؤول.",
  required: "هذا الحقل مطلوب",
  invalidQuantity: "الكمية المستهلكة يجب أن تكون أكبر من صفر ولا تتجاوز المخزون المتاح",
  success: "تم تسجيل الاستهلاك بنجاح.",
  reasons: {
    daily: "استخدام يومي",
    damaged: "تالف",
    expired: "التخلص من منتهي الصلاحية",
    operational: "استخدام تشغيلي",
    other: "أخرى",
  }
};

const getId = (value) => value?._id || value || "";

const getBasePath = (role, isArabic) => {
  const prefix = isArabic ? "/ar" : "";
  return role === "admin" ? `${prefix}/admin/consumptions` : `${prefix}/user/consumptions`;
};

const CreateConsumptionView = ({ isArabic = false }) => {
  const labels = isArabic ? labelsAr : labelsEn;
  const locale = isArabic ? "ar" : "en";
  const navigate = useNavigate();
  const { role, user } = getStoredAuth();
  const assignedWarehouse = user?.assigned_warehouse;
  const assignedWarehouseId = getId(assignedWarehouse);
  const isAdmin = role === "admin";
  const basePath = getBasePath(role, isArabic);
  const [form, setForm] = useState({
    warehouse_id: isAdmin ? "" : assignedWarehouseId,
    product_id: "",
    consumed_quantity: "",
    reason: "",
    department: isAdmin ? "" : "Kitchen",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: warehouses, loading: warehousesLoading } = useApiResource(() => api.warehouses.list(), []);
  const { data: stockRows, loading: stockLoading } = useApiResource(
    () => form.warehouse_id ? api.productWarehouses.list({ warehouse_id: form.warehouse_id }) : Promise.resolve([]),
    [form.warehouse_id]
  );

  useEffect(() => {
    if (!isAdmin && assignedWarehouseId) {
      setForm((current) => ({ ...current, warehouse_id: assignedWarehouseId }));
    }
  }, [assignedWarehouseId, isAdmin]);

  const productOptions = stockRows
    .filter((row) => Number(row.quantity || 0) > 0 && row.product_id)
    .map((row) => ({
      value: getId(row.product_id),
      label: `${getLocalizedValue(row.product_id, "name", locale) || "Unknown product"} (${row.quantity} ${row.product_id?.unit || ""})`,
    }));

  const selectedStock = useMemo(
    () => stockRows.find((row) => getId(row.product_id) === form.product_id),
    [stockRows, form.product_id]
  );
  const selectedProduct = selectedStock?.product_id;
  const availableQuantity = Number(selectedStock?.quantity || 0);

  const updateField = (key, value) => {
    setErrors((current) => ({ ...current, [key]: "" }));
    setMessage("");
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "warehouse_id" ? { product_id: "", consumed_quantity: "" } : {}),
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.warehouse_id) nextErrors.warehouse_id = labels.required;
    if (!form.product_id) nextErrors.product_id = labels.required;
    if (!form.reason) nextErrors.reason = labels.required;
    const quantity = Number(form.consumed_quantity);
    if (!quantity || quantity <= 0 || quantity > availableQuantity) {
      nextErrors.consumed_quantity = labels.invalidQuantity;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setMessage("");
    try {
      await api.consumptions.create({
        warehouse_id: form.warehouse_id,
        product_id: form.product_id,
        consumed_quantity: Number(form.consumed_quantity),
        reason: form.reason,
        department: form.department,
        notes: form.notes,
      });
      setMessage(labels.success);
      navigate(basePath);
    } catch (requestError) {
      setMessage(requestError.message || "Unable to record consumption.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin && !assignedWarehouseId) {
    return <div className={`p-6 lg:p-8 ${isArabic ? "rtl text-right" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
      <PageHeader title={labels.title} subtitle={labels.subtitle} />
      <div className="rounded-xl border border-[#D4183D]/20 bg-[#D4183D]/8 px-4 py-3 text-sm text-[#8A1F11]">{labels.assignedMissing}</div>
    </div>;
  }

  return <form onSubmit={submit} className={`p-6 lg:p-8 space-y-6 ${isArabic ? "rtl text-right" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
    <PageHeader title={labels.title} subtitle={labels.subtitle} />
    {message && <div className="rounded-xl border border-[#4E4631]/10 bg-white px-4 py-3 text-sm text-[#2E3A24]">{message}</div>}
    <div className="rounded-2xl border border-[#4E4631]/10 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isAdmin ? <Select
          label={labels.warehouse}
          value={form.warehouse_id}
          onChange={(event) => updateField("warehouse_id", event.target.value)}
          error={errors.warehouse_id}
          options={[
            { value: "", label: warehousesLoading ? "Loading warehouses..." : labels.selectWarehouse, disabled: true },
            ...warehouses.map((warehouse) => ({ value: warehouse._id, label: getLocalizedValue(warehouse, "name", locale) })),
          ]}
        /> : <Input label={labels.warehouse} value={assignedWarehouse?.name || user?.assigned_warehouse_name || ""} readOnly />}
        <Select
          label={labels.product}
          value={form.product_id}
          onChange={(event) => updateField("product_id", event.target.value)}
          error={errors.product_id}
          disabled={!form.warehouse_id || stockLoading}
          options={[
            { value: "", label: stockLoading ? "Loading products..." : labels.selectProduct, disabled: true },
            ...productOptions,
          ]}
        />
        <Input label={labels.available} value={selectedStock ? availableQuantity : ""} readOnly />
        <Input label={labels.unit} value={selectedProduct?.unit || ""} readOnly />
        <Input
          label={labels.quantity}
          type="number"
          min="0"
          step="0.01"
          value={form.consumed_quantity}
          onChange={(event) => updateField("consumed_quantity", event.target.value)}
          error={errors.consumed_quantity}
        />
        <Select
          label={labels.reason}
          value={form.reason}
          onChange={(event) => updateField("reason", event.target.value)}
          error={errors.reason}
          options={[
            { value: "", label: labels.reason, disabled: true },
            { value: labels.reasons.daily, label: labels.reasons.daily },
            { value: labels.reasons.damaged, label: labels.reasons.damaged },
            { value: labels.reasons.expired, label: labels.reasons.expired },
            { value: labels.reasons.operational, label: labels.reasons.operational },
            { value: labels.reasons.other, label: labels.reasons.other },
          ]}
        />
        <Input label={labels.department} value={form.department} onChange={(event) => updateField("department", event.target.value)} />
        <div className="md:col-span-2">
          <Input label={labels.notes} value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? labels.saving : labels.save}
        </Button>
      </div>
    </div>
  </form>;
};

const CreateConsumption = () => <CreateConsumptionView />;

export {
  CreateConsumption,
  CreateConsumptionView
};
