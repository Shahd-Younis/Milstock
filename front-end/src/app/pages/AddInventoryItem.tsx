import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Save, X } from 'lucide-react';
import { api } from '../lib/api';
import { ProductDoc, WarehouseDoc } from '../lib/types';
import { useApiResource } from '../lib/useApiResource';

const unitOptions = [
  { value: '', label: 'Select unit...' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'liter', label: 'liter' },
  { value: 'Tons', label: 'Tons' },
  { value: 'piece', label: 'piece' },
  { value: 'box', label: 'box' },
];

export const AddInventoryItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } =
    useApiResource<WarehouseDoc>(() => api.warehouses.list(), []);
  const { data: products, loading: productsLoading } =
    useApiResource<ProductDoc>(() => api.products.list(), []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    min_quantity: '',
    warehouse_id: '',
    expiry_date: '',
  });

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return [
      { value: '', label: productsLoading ? 'Loading categories...' : 'Select category...' },
      ...categories.map((category) => ({ value: category, label: category })),
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
      warehouse_id: product.warehouse_id?._id || '',
      expiry_date: product.expiry_date ? product.expiry_date.slice(0, 10) : '',
    });
  }, [id, isEdit, products]);

  const handleChange =
    (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      min_quantity: Number(form.min_quantity),
      warehouse_id: form.warehouse_id,
      expiry_date: form.expiry_date || undefined,
    };

    try {
      if (isEdit && id) {
        await api.products.update(id, payload);
      } else {
        await api.products.create(payload);
      }
      navigate('/admin/inventory');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        subtitle={isEdit ? `Editing MongoDB Product: ${id}` : 'Create a new item in the inventory system'}
      />

      <div className="max-w-4xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {message && <p className="text-sm text-[#C0392B]">{message}</p>}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Item Name *"
                  placeholder="Enter item name"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
                <Select
                  label="Category *"
                  options={
                    categoryOptions.length > 1
                      ? categoryOptions
                      : [
                          { value: '', label: 'No MongoDB categories yet' },
                          { value: 'Food', label: 'Food' },
                          { value: 'Dairy', label: 'Dairy' },
                          { value: 'Bakery', label: 'Bakery' },
                          { value: 'Pantry', label: 'Pantry' },
                        ]
                  }
                  value={form.category}
                  onChange={handleChange('category')}
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
                  onChange={handleChange('quantity')}
                  min="0"
                  required
                />
                <Select
                  label="Unit Type *"
                  options={unitOptions}
                  value={form.unit}
                  onChange={handleChange('unit')}
                  required
                />
                <Input
                  label="Low Stock Threshold *"
                  type="number"
                  placeholder="0"
                  value={form.min_quantity}
                  onChange={handleChange('min_quantity')}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-foreground font-semibold mb-4">Location & Storage</h3>
              <Select
                label="Warehouse *"
                options={[
                  {
                    value: '',
                    label: warehousesLoading
                      ? 'Loading warehouses...'
                      : warehousesError || 'Select warehouse...',
                  },
                  ...warehouses.map((warehouse) => ({
                    value: warehouse._id,
                    label: `${warehouse.name} - ${warehouse.location}`,
                  })),
                ]}
                value={form.warehouse_id}
                onChange={handleChange('warehouse_id')}
                disabled={warehousesLoading}
                required
              />
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-foreground font-semibold mb-4">Expiration & Tracking</h3>
              <Input
                label="Expiration Date"
                type="date"
                value={form.expiry_date}
                onChange={handleChange('expiry_date')}
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-border">
              <Button type="submit" className="flex-1" disabled={saving}>
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : isEdit ? 'Update Item' : 'Add Item'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/inventory')}>
                <X className="w-5 h-5" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
