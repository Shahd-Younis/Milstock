import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, X } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { PageHeaderAr } from "../components/ar/PageHeaderAr";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
import { getLocalizedValue } from "../lib/localization";
import { isDateRangeValid, isValidDateInput, toDateInputValue } from "../lib/dateValidation";

const translations = {
  en: {
    titleAdd: "Add New Inventory Item",
    titleEdit: "Edit Inventory Item",
    subtitleAdd: "Create a new item in the inventory system",
    subtitleEdit: (id) => `Editing MongoDB Product: ${id}`,
    sections: {
      basicInformation: "Basic Information",
      stockInformation: "Stock Information",
      locationStorage: "Location & Storage",
      expirationTracking: "Expiration & Tracking",
      additionalDetails: "Additional Details",
    },
    fields: {
      itemName: "English Item Name *",
      arabicItemName: "Arabic Item Name *",
      category: "English Category *",
      arabicCategory: "Arabic Category *",
      initialQuantity: "Initial Quantity *",
      unitType: "Unit Type *",
      lowStockThreshold: "Low Stock Threshold *",
      warehouse: "Warehouse *",
      storageSection: "Storage Section",
      expirationDate: "Expiration Date",
      manufacturingDate: "Manufacturing Date",
      batchNumber: "Batch Number",
      serialNumber: "Serial Number",
      description: "English Description",
      arabicDescription: "Arabic Description",
      notes: "Notes",
    },
    placeholders: {
      itemName: "Enter English item name",
      arabicItemName: "Enter Arabic item name",
      category: "Select category...",
      noCategories: "No MongoDB categories yet",
      arabicCategory: "Enter Arabic category",
      quantity: "0",
      unit: "Select unit...",
      lowStock: "0",
      warehouse: "Select warehouse...",
      loadingWarehouses: "Loading warehouses...",
      storageSection: "e.g., B-12",
      batchNumber: "Enter batch number",
      serialNumber: "Enter serial number",
      description: "Describe this food item in English",
      arabicDescription: "Describe this food item in Arabic",
      notes: "Internal storage or handling notes",
    },
    messages: {
      englishNameRequired: "English name is required.",
      arabicNameRequired: "Arabic name is required.",
      englishCategoryRequired: "English category is required.",
      arabicCategoryRequired: "Arabic category is required.",
      warehouseRequired: "Warehouse is required.",
      invalidDate: "Enter a valid date.",
      invalidDateRange: "Manufacturing date cannot be after expiration date.",
      created: "Item created successfully.",
      updated: "Item updated successfully.",
      saveFailed: "Unable to save product",
      loadingCategories: "Loading categories...",
    },
    actions: {
      addItem: "Add Item",
      updateItem: "Update Item",
      saving: "Saving...",
      cancel: "Cancel",
    },
    fallbackCategories: ["Food", "Dairy", "Bakery", "Pantry"],
  },
  ar: {
    titleAdd: "إضافة صنف جديد",
    titleEdit: "تعديل الصنف",
    subtitleAdd: "إضافة صنف غذائي جديد إلى المخزون",
    subtitleEdit: () => "تحديث بيانات صنف غذائي من MongoDB",
    sections: {
      basicInformation: "المعلومات الأساسية",
      stockInformation: "معلومات المخزون",
      locationStorage: "الموقع والتخزين",
      expirationTracking: "انتهاء الصلاحية والتتبع",
      additionalDetails: "تفاصيل إضافية",
    },
    fields: {
      itemName: "اسم الصنف بالإنجليزي *",
      arabicItemName: "اسم الصنف بالعربي *",
      category: "الفئة بالإنجليزي *",
      arabicCategory: "الفئة بالعربي *",
      initialQuantity: "الكمية الأولية *",
      unitType: "الوحدة *",
      lowStockThreshold: "حد انخفاض المخزون *",
      warehouse: "المخزن *",
      storageSection: "قسم التخزين",
      expirationDate: "تاريخ انتهاء الصلاحية",
      manufacturingDate: "تاريخ التصنيع",
      batchNumber: "رقم التشغيلة",
      serialNumber: "الرقم التسلسلي",
      description: "الوصف",
      arabicDescription: "الوصف بالعربي",
      notes: "ملاحظات",
    },
    placeholders: {
      itemName: "اكتب اسم الصنف بالإنجليزي",
      arabicItemName: "اكتب اسم الصنف بالعربي",
      category: "اختر الفئة...",
      noCategories: "لا توجد فئات في MongoDB",
      arabicCategory: "اكتب الفئة بالعربي",
      quantity: "0",
      unit: "اختر وحدة القياس",
      lowStock: "0",
      warehouse: "اختر المخزن...",
      loadingWarehouses: "جاري تحميل المخازن...",
      storageSection: "مثال: B-12",
      batchNumber: "أدخل رقم التشغيلة",
      serialNumber: "أدخل الرقم التسلسلي",
      description: "اكتب وصف الصنف",
      arabicDescription: "اكتب وصف الصنف بالعربي",
      notes: "ملاحظات التخزين أو التعامل الداخلي",
    },
    messages: {
      englishNameRequired: "اسم الصنف بالإنجليزي مطلوب.",
      arabicNameRequired: "اسم الصنف بالعربي مطلوب.",
      englishCategoryRequired: "الفئة بالإنجليزي مطلوبة.",
      arabicCategoryRequired: "الفئة بالعربي مطلوبة.",
      warehouseRequired: "المخزن مطلوب.",
      invalidDate: "أدخل تاريخًا صحيحًا.",
      invalidDateRange: "تاريخ التصنيع لا يمكن أن يكون بعد تاريخ انتهاء الصلاحية.",
      created: "تم إنشاء الصنف بنجاح.",
      updated: "تم تحديث الصنف بنجاح.",
      saveFailed: "تعذر حفظ الصنف",
      loadingCategories: "جاري تحميل الفئات...",
    },
    actions: {
      addItem: "إضافة الصنف",
      updateItem: "حفظ التعديلات",
      saving: "جاري الحفظ...",
      cancel: "إلغاء",
    },
    fallbackCategories: ["أغذية", "ألبان", "مخبوزات", "مواد جافة"],
  },
};

const unitOptionsByLocale = {
  en: [
    { value: "", label: "Select unit..." },
    { value: "kg", label: "kg" },
    { value: "g", label: "g" },
    { value: "liter", label: "liter" },
    { value: "Tons", label: "Tons" },
    { value: "piece", label: "piece" },
    { value: "box", label: "box" },
  ],
  ar: [
    { value: "", label: "اختر وحدة القياس" },
    { value: "kg", label: "كجم" },
    { value: "g", label: "جرام" },
    { value: "liter", label: "لتر" },
    { value: "Tons", label: "طن" },
    { value: "piece", label: "قطعة" },
    { value: "box", label: "صندوق" },
  ],
};

const categoryTranslations = {
  Food: "أغذية",
  Dairy: "ألبان",
  Bakery: "مخبوزات",
  Pantry: "مواد جافة",
  "Canned Food": "أغذية معلبة",
  "Frozen Food": "أغذية مجمدة",
  "Fresh Produce": "منتجات طازجة",
  Beverages: "مشروبات",
  "Dry Goods": "مواد جافة",
  "مواد جافة": "Dry Goods",
  "منتجات طازجة": "Fresh Produce",
  "أغذية معلبة": "Canned Food",
  "أغذية مجمدة": "Frozen Food",
  "مشروبات": "Beverages",
  "معلبات": "Canned Food",
  "مخبوزات": "Bakery",
  "ألبان": "Dairy",
};

const fallbackCategoryOptions = [
  { value: "Food", labelEn: "Food", labelAr: "أغذية" },
  { value: "Dairy", labelEn: "Dairy", labelAr: "ألبان" },
  { value: "Bakery", labelEn: "Bakery", labelAr: "مخبوزات" },
  { value: "Dry Goods", labelEn: "Dry Goods", labelAr: "مواد جافة" },
  { value: "Fresh Produce", labelEn: "Fresh Produce", labelAr: "منتجات طازجة" },
];

const getArabicCategory = (category) => {
  if (!category) return "";
  return categoryTranslations[category] || "";
};

const initialForm = {
  name: "",
  nameAr: "",
  category: "",
  categoryAr: "",
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
  descriptionAr: "",
  notes: "",
};

const Section = ({ title, children, withDivider = true }) => (
  <div className={withDivider ? "border-t border-border pt-6" : ""}>
    <h3 className="text-foreground font-semibold mb-4 text-start">{title}</h3>
    {children}
  </div>
);

const TextareaField = ({ label, className = "", ...props }) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-[#2E3A24] text-start">{label}</label>
    <textarea
      className={`w-full min-h-28 px-4 py-2.5 rounded-xl bg-white border border-[#4E4631]/15 text-[#2E3A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#6A7B4D]/30 focus:border-[#6A7B4D] ${className}`}
      {...props}
    />
  </div>
);

const AddInventoryItemForm = ({ locale = "en" }) => {
  const isArabic = locale === "ar";
  const t = translations[locale] || translations.en;
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useApiResource(() => api.warehouses.list(), []);
  const { data: products, loading: productsLoading } = useApiResource(() => api.products.list(), []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [form, setForm] = useState(initialForm);
  const Header = isArabic ? PageHeaderAr : PageHeader;
  const inventoryPath = isArabic ? "/ar/admin/inventory" : "/admin/inventory";
  const fieldClass = isArabic ? "text-right" : "";

  const categoryOptions = useMemo(() => {
    const seen = new Set();
    const categories = products.reduce((acc, product) => {
      const englishCategory = product.category || "";
      if (!englishCategory || seen.has(englishCategory)) return acc;
      seen.add(englishCategory);
      acc.push({
        value: englishCategory,
        label: locale === "ar" ? (product.categoryAr || getArabicCategory(englishCategory) || englishCategory) : englishCategory,
        categoryAr: product.categoryAr || getArabicCategory(englishCategory),
      });
      return acc;
    }, []);
    return [
      { value: "", label: productsLoading ? t.messages.loadingCategories : t.placeholders.category },
      ...categories,
    ];
  }, [locale, products, productsLoading, t.messages.loadingCategories, t.placeholders.category]);

  useEffect(() => {
    if (!isEdit) return;
    const product = products.find((entry) => entry._id === id);
    if (!product) return;
    const expirationDate = product.expiration_date || product.expiry_date;
    setForm({
      name: product.name || "",
      nameAr: product.nameAr || "",
      category: product.category || "",
      categoryAr: product.categoryAr || "",
      quantity: String(product.quantity ?? ""),
      unit: product.unit || "",
      min_quantity: String(product.min_quantity ?? ""),
      warehouse_id: product.warehouse_id?._id || product.warehouse_id || "",
      warehouse_name: product.warehouse_name || product.warehouse_id?.name || "",
      storage_section: product.storage_section || "",
      expiry_date: toDateInputValue(expirationDate),
      expiration_date: toDateInputValue(expirationDate),
      manufacturing_date: toDateInputValue(product.manufacturing_date),
      batch_number: product.batch_number || "",
      serial_number: product.serial_number || "",
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      notes: product.notes || "",
    });
  }, [id, isEdit, products]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    const selectedOption = categoryOptions.find((option) => option.value === category);
    setForm((current) => ({
      ...current,
      category,
      categoryAr: current.categoryAr || selectedOption?.categoryAr || getArabicCategory(category),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    if (!form.name.trim()) {
      setMessageType("error");
      setMessage(t.messages.englishNameRequired);
      setSaving(false);
      return;
    }
    if (!form.nameAr.trim()) {
      setMessageType("error");
      setMessage(t.messages.arabicNameRequired);
      setSaving(false);
      return;
    }
    if (!form.category.trim()) {
      setMessageType("error");
      setMessage(t.messages.englishCategoryRequired);
      setSaving(false);
      return;
    }
    if (!form.categoryAr.trim()) {
      setMessageType("error");
      setMessage(t.messages.arabicCategoryRequired);
      setSaving(false);
      return;
    }
    if (!form.warehouse_id) {
      setMessageType("error");
      setMessage(t.messages.warehouseRequired);
      setSaving(false);
      return;
    }
    const expirationDate = form.expiration_date || form.expiry_date || "";
    if (!isValidDateInput(expirationDate) || !isValidDateInput(form.manufacturing_date)) {
      setMessageType("error");
      setMessage(t.messages.invalidDate);
      setSaving(false);
      return;
    }
    if (!isDateRangeValid(form.manufacturing_date, expirationDate)) {
      setMessageType("error");
      setMessage(t.messages.invalidDateRange);
      setSaving(false);
      return;
    }

    const selectedWarehouse = warehouses.find((warehouse) => warehouse._id === form.warehouse_id);
    const payload = {
      name: form.name.trim(),
      nameAr: form.nameAr.trim(),
      category: form.category.trim(),
      categoryAr: form.categoryAr.trim(),
      quantity: Number(form.quantity),
      unit: form.unit,
      min_quantity: Number(form.min_quantity),
      warehouse_id: form.warehouse_id,
      warehouse_name: selectedWarehouse?.name || form.warehouse_name || "",
      storage_section: form.storage_section,
      expiry_date: expirationDate || undefined,
      expiration_date: expirationDate || undefined,
      manufacturing_date: form.manufacturing_date || undefined,
      batch_number: form.batch_number,
      serial_number: form.serial_number,
      description: form.description.trim(),
      descriptionAr: form.descriptionAr.trim(),
      notes: form.notes,
    };

    try {
      if (isEdit && id) {
        await api.products.update(id, payload);
      } else {
        await api.products.create(payload);
      }
      setMessageType("success");
      setMessage(isEdit ? t.messages.updated : t.messages.created);
      window.setTimeout(() => navigate(inventoryPath), 700);
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : t.messages.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  return <div dir={isArabic ? "rtl" : "ltr"} className="p-6 lg:p-8 space-y-6">
    <Header
      title={isEdit ? t.titleEdit : t.titleAdd}
      subtitle={isEdit ? t.subtitleEdit(id) : t.subtitleAdd}
    />

    <div className="max-w-4xl">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-8">
          {message && <div className={`rounded-xl px-4 py-3 text-sm text-start ${messageType === "success" ? "border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 text-[#3d6b2e]" : "border border-[#D4183D]/20 bg-[#D4183D]/10 text-[#D4183D]"}`}>{message}</div>}

          <Section title={t.sections.basicInformation} withDivider={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label={t.fields.itemName} placeholder={t.placeholders.itemName} value={form.name} onChange={handleChange("name")} required className={fieldClass} />
              <Input label={t.fields.arabicItemName} placeholder={t.placeholders.arabicItemName} value={form.nameAr} onChange={handleChange("nameAr")} required className={fieldClass} />
              <Select
                label={t.fields.category}
                options={categoryOptions.length > 1 ? categoryOptions : [
                  { value: "", label: t.placeholders.noCategories },
                  ...fallbackCategoryOptions.map((category) => ({
                    value: category.value,
                    label: locale === "ar" ? category.labelAr : category.labelEn,
                    categoryAr: category.labelAr,
                  })),
                ]}
                value={form.category}
                onChange={handleCategoryChange}
                required
                className={fieldClass}
              />
              <Input label={t.fields.arabicCategory} placeholder={t.placeholders.arabicCategory} value={form.categoryAr} onChange={handleChange("categoryAr")} required className={fieldClass} />
            </div>
          </Section>

          <Section title={t.sections.stockInformation}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label={t.fields.initialQuantity} type="number" placeholder={t.placeholders.quantity} value={form.quantity} onChange={handleChange("quantity")} min="0" required className={fieldClass} />
              <Select label={t.fields.unitType} options={unitOptionsByLocale[locale]} value={form.unit} onChange={handleChange("unit")} required className={fieldClass} />
              <Input label={t.fields.lowStockThreshold} type="number" placeholder={t.placeholders.lowStock} value={form.min_quantity} onChange={handleChange("min_quantity")} min="0" required className={fieldClass} />
            </div>
          </Section>

          <Section title={t.sections.locationStorage}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label={t.fields.warehouse}
                options={[
                  {
                    value: "",
                    label: warehousesLoading ? t.placeholders.loadingWarehouses : warehousesError || t.placeholders.warehouse,
                  },
                  ...warehouses.map((warehouse) => ({
                    value: warehouse._id,
                    label: `${getLocalizedValue(warehouse, "name", locale)} - ${getLocalizedValue(warehouse, "location", locale)}`,
                  })),
                ]}
                value={form.warehouse_id}
                onChange={handleChange("warehouse_id")}
                disabled={warehousesLoading}
                required
                className={fieldClass}
              />
              <Input label={t.fields.storageSection} placeholder={t.placeholders.storageSection} value={form.storage_section} onChange={handleChange("storage_section")} className={fieldClass} />
            </div>
          </Section>

          <Section title={t.sections.expirationTracking}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label={t.fields.expirationDate} type="date" value={form.expiration_date || form.expiry_date} onChange={handleChange("expiration_date")} className={fieldClass} />
              <Input label={t.fields.manufacturingDate} type="date" value={form.manufacturing_date} onChange={handleChange("manufacturing_date")} className={fieldClass} />
              <Input label={t.fields.batchNumber} placeholder={t.placeholders.batchNumber} value={form.batch_number} onChange={handleChange("batch_number")} className={fieldClass} />
              <Input label={t.fields.serialNumber} placeholder={t.placeholders.serialNumber} value={form.serial_number} onChange={handleChange("serial_number")} className={fieldClass} />
            </div>
          </Section>

          <Section title={t.sections.additionalDetails}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextareaField label={t.fields.description} placeholder={t.placeholders.description} value={form.description} onChange={handleChange("description")} className={fieldClass} />
              <TextareaField label={t.fields.notes} placeholder={t.placeholders.notes} value={form.notes} onChange={handleChange("notes")} className={fieldClass} />
            </div>
          </Section>

          <div className={`flex gap-4 pt-6 border-t border-border ${isArabic ? "flex-row-reverse" : ""}`}>
            <Button type="submit" className="flex-1" disabled={saving}>
              <Save className="w-5 h-5" />
              {saving ? t.actions.saving : isEdit ? t.actions.updateItem : t.actions.addItem}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(inventoryPath)}>
              <X className="w-5 h-5" />
              {t.actions.cancel}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </div>;
};

export {
  AddInventoryItemForm
};
