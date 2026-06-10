import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Save, X } from "lucide-react";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
const unitOptions = [
  { value: "", label: "Select unit..." },
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "liter", label: "liter" },
  { value: "Tons", label: "Tons" },
  { value: "piece", label: "piece" },
  { value: "box", label: "box" }
];
const AddInventoryItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useApiResource(() => api.warehouses.list(), []);
  const { data: products, loading: productsLoading } = useApiResource(() => api.products.list(), []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [form, setForm] = useState({
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
  });
  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return [
      { value: "", label: productsLoading ? "Loading categories..." : "Select category..." },
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
      warehouse_name: product.warehouse_name || product.warehouse_id?.name || "",
      storage_section: product.storage_section || "",
      expiry_date: (product.expiration_date || product.expiry_date) ? (product.expiration_date || product.expiry_date).slice(0, 10) : "",
      expiration_date: (product.expiration_date || product.expiry_date) ? (product.expiration_date || product.expiry_date).slice(0, 10) : "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    if (!form.warehouse_id) {
      setMessageType("error");
      setMessage("Warehouse is required.");
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
      expiry_date: form.expiration_date || form.expiry_date || void 0,
      expiration_date: form.expiration_date || form.expiry_date || void 0,
      manufacturing_date: form.manufacturing_date || void 0,
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
      setMessage(isEdit ? "Item updated successfully." : "Item created successfully.");
      window.setTimeout(() => navigate("/admin/inventory"), 700);
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  };
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
    title={isEdit ? "Edit Inventory Item" : "Add New Inventory Item"}
    subtitle={isEdit ? `Editing MongoDB Product: ${id}` : "Create a new item in the inventory system"}
  />

      <div className="max-w-4xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {message && <div className={`rounded-xl px-4 py-3 text-sm ${messageType === "success" ? "border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 text-[#3d6b2e]" : "border border-[#D4183D]/20 bg-[#D4183D]/10 text-[#D4183D]"}`}>{message}</div>}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
    label="Item Name *"
    placeholder="Enter item name"
    value={form.name}
    onChange={handleChange("name")}
    required
  />
                <Select
    label="Category *"
    options={categoryOptions.length > 1 ? categoryOptions : [
      { value: "", label: "No MongoDB categories yet" },
      { value: "Food", label: "Food" },
      { value: "Dairy", label: "Dairy" },
      { value: "Bakery", label: "Bakery" },
      { value: "Pantry", label: "Pantry" }
    ]}
    value={form.category}
    onChange={handleChange("category")}
    required
  />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-foreground font-semibold mb-4">Stock Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
    label="Initial Quantity *"
    type="number"
    placeholder="0"
    value={form.quantity}
    onChange={handleChange("quantity")}
    min="0"
    required
  />
                <Select
    label="Unit Type *"
    options={unitOptions}
    value={form.unit}
    onChange={handleChange("unit")}
    required
  />
                <Input
    label="Low Stock Threshold *"
    type="number"
    placeholder="0"
    value={form.min_quantity}
    onChange={handleChange("min_quantity")}
    min="0"
    required
  />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-foreground font-semibold mb-4">Location & Storage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
    label="Warehouse *"
    options={[
      {
        value: "",
        label: warehousesLoading ? "Loading warehouses..." : warehousesError || "Select warehouse..."
      },
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
                <Input
    label="Storage Section"
    placeholder="e.g., B-12"
    value={form.storage_section}
    onChange={handleChange("storage_section")}
  />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-foreground font-semibold mb-4">Expiration & Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
    label="Expiration Date"
    type="date"
    value={form.expiration_date || form.expiry_date}
    onChange={handleChange("expiration_date")}
  />
                <Input
    label="Manufacturing Date"
    type="date"
    value={form.manufacturing_date}
    onChange={handleChange("manufacturing_date")}
  />
                <Input
    label="Batch Number"
    placeholder="Enter batch number"
    value={form.batch_number}
    onChange={handleChange("batch_number")}
  />
                <Input
    label="Serial Number"
    placeholder="Enter serial number"
    value={form.serial_number}
    onChange={handleChange("serial_number")}
  />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-foreground font-semibold mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-[#2E3A24]">Description</label>
                  <textarea
                    className="w-full min-h-28 px-4 py-2.5 rounded-xl bg-white border border-[#4E4631]/15 text-[#2E3A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#6A7B4D]/30 focus:border-[#6A7B4D]"
                    placeholder="Describe this food item"
                    value={form.description}
                    onChange={handleChange("description")}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-[#2E3A24]">Notes</label>
                  <textarea
                    className="w-full min-h-28 px-4 py-2.5 rounded-xl bg-white border border-[#4E4631]/15 text-[#2E3A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#6A7B4D]/30 focus:border-[#6A7B4D]"
                    placeholder="Internal storage or handling notes"
                    value={form.notes}
                    onChange={handleChange("notes")}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-border">
              <Button type="submit" className="flex-1" disabled={saving}>
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : isEdit ? "Update Item" : "Add Item"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/inventory")}>
                <X className="w-5 h-5" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>;
};
export {
  AddInventoryItem
};
