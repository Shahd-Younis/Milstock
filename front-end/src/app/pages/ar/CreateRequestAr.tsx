import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Send } from 'lucide-react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { api } from '../../lib/api';
import { ProductDoc, SupplierDoc, WarehouseDoc } from '../../lib/types';
import { useApiResource } from '../../lib/useApiResource';

interface RequestItem {
  id: string;
  product_id: string;
  quantity: string;
  unit_price: string;
}

export const CreateRequestAr = () => {
  const navigate = useNavigate();
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<RequestItem[]>([
    { id: '1', product_id: '', quantity: '', unit_price: '' },
  ]);
  const { data: products, loading: productsLoading, error: productsError } =
    useApiResource<ProductDoc>(() => api.products.list(), []);
  const { data: suppliers, loading: suppliersLoading, error: suppliersError } =
    useApiResource<SupplierDoc>(() => api.suppliers.list(), []);
  const { data: warehouses, loading: warehousesLoading } =
    useApiResource<WarehouseDoc>(() => api.warehouses.list(), []);

  const addItem = () => {
    setItems((current) => [
      ...current,
      { id: Date.now().toString(), product_id: '', quantity: '', unit_price: '' },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof RequestItem, value: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.orders.create({
        supplier_id: supplierId,
        warehouse_id: warehouseId || undefined,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price || 0),
        })),
      });
      navigate('/ar/user/requests');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر إنشاء الطلب');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir="rtl" className="p-6 lg:p-8 space-y-6">
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
                { value: '', label: suppliersLoading ? 'جار تحميل الموردين...' : suppliersError || 'اختر المورد' },
                ...suppliers.map((supplier) => ({ value: supplier._id, label: supplier.name })),
              ]}
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
              disabled={suppliersLoading}
              required
            />
            <Select
              options={[
                { value: '', label: warehousesLoading ? 'جار تحميل المستودعات...' : 'اختر مستودع التسليم' },
                ...warehouses.map((warehouse) => ({ value: warehouse._id, label: warehouse.name })),
              ]}
              value={warehouseId}
              onChange={(event) => setWarehouseId(event.target.value)}
              disabled={warehousesLoading}
            />
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
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="font-medium text-foreground text-right">الصنف {index + 1}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    options={[
                      { value: '', label: productsLoading ? 'جار تحميل المنتجات...' : productsError || 'اختر المنتج' },
                      ...products.map((product) => ({
                        value: product._id,
                        label: `${product.name} (${product.quantity} ${product.unit})`,
                      })),
                    ]}
                    value={item.product_id}
                    onChange={(event) => updateItem(item.id, 'product_id', event.target.value)}
                    disabled={productsLoading}
                    required
                  />
                  <Input
                    label="الكمية *"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateItem(item.id, 'quantity', event.target.value)}
                    required
                    className="text-right"
                  />
                  <Input
                    label="سعر الوحدة *"
                    type="number"
                    min="0"
                    value={item.unit_price}
                    onChange={(event) => updateItem(item.id, 'unit_price', event.target.value)}
                    required
                    className="text-right"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/ar/user/requests')}>
            إلغاء
          </Button>
          <Button type="submit" disabled={saving}>
            <Send className="w-4 h-4" />
            {saving ? 'جار الإرسال...' : 'إرسال الطلب'}
          </Button>
        </div>
      </form>
    </div>
  );
};
