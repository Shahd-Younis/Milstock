import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Send, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';
import { ProductDoc, SupplierDoc, WarehouseDoc } from '../lib/types';
import { useApiResource } from '../lib/useApiResource';

interface RequestItem {
  product_id: string;
  quantity: string;
  unit_price: string;
}

export const CreateRequest = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RequestItem[]>([{ product_id: '', quantity: '', unit_price: '' }]);
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { data: products, loading: productsLoading, error: productsError } =
    useApiResource<ProductDoc>(() => api.products.list(), []);
  const { data: suppliers, loading: suppliersLoading, error: suppliersError } =
    useApiResource<SupplierDoc>(() => api.suppliers.list(), []);
  const { data: warehouses, loading: warehousesLoading } =
    useApiResource<WarehouseDoc>(() => api.warehouses.list(), []);

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: '', unit_price: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof RequestItem, value: string) => {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.orders.create({
        supplier_id: supplierId,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price || 0),
        })),
      });
      navigate('/user/requests');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader title="Create Supply Request" subtitle="Submit a new request for food supplies" />

      <div className="max-w-4xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && <p className="text-sm text-[#D4183D]">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Supplier *"
                options={[
                  { value: '', label: suppliersLoading ? 'Loading suppliers...' : suppliersError || 'Select supplier...' },
                  ...suppliers.map((supplier) => ({ value: supplier._id, label: supplier.name })),
                ]}
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                disabled={suppliersLoading}
                required
              />
              <Select
                label="Delivery Warehouse"
                options={[
                  { value: '', label: warehousesLoading ? 'Loading warehouses...' : 'Select warehouse...' },
                  ...warehouses.map((warehouse) => ({ value: warehouse._id, label: warehouse.name })),
                ]}
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                disabled={warehousesLoading}
              />
            </div>

            <div>
              <label className="block mb-4 text-foreground font-semibold">Requested Items</label>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 bg-background rounded-xl border border-border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <Select
                          label="Product *"
                          options={[
                            { value: '', label: productsLoading ? 'Loading products...' : productsError || 'Select product...' },
                            ...products.map((product) => ({
                              value: product._id,
                              label: `${product.name} (${product.quantity} ${product.unit})`,
                            })),
                          ]}
                          value={item.product_id}
                          onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                          disabled={productsLoading}
                          required
                        />
                      </div>
                      <Input
                        label="Quantity *"
                        type="number"
                        placeholder="0"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        required
                      />
                      <Input
                        label="Unit Price *"
                        type="number"
                        placeholder="0"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        required
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-3 text-destructive hover:text-destructive-foreground flex items-center gap-2 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Remove Item
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={addItem} className="mt-4">
                + Add Another Item
              </Button>
            </div>

            <div>
              <label className="block mb-2 text-foreground">Additional Notes</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-input-background text-foreground min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                placeholder="Add any additional information or special requirements..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={saving}>
                <Send className="w-5 h-5" />
                {saving ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
