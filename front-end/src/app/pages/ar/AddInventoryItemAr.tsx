import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Save, X } from 'lucide-react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { api } from '../../lib/api';
import { ProductDoc, WarehouseDoc } from '../../lib/types';
import { useApiResource } from '../../lib/useApiResource';

const unitOptions = [
  { value: '', label: 'اختر وحدة القياس' },
  { value: 'kg', label: 'كغم' },
  { value: 'g', label: 'غرام' },
  { value: 'liter', label: 'لتر' },
  { value: 'piece', label: 'قطعة' },
  { value: 'box', label: 'صندوق' },
];

export const AddInventoryItemAr = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: products, loading: productsLoading } =
    useApiResource<ProductDoc>(() => api.products.list(), []);
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } =
    useApiResource<WarehouseDoc>(() => api.warehouses.list(), []);
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
      { value: '', label: productsLoading ? 'جار تحميل الفئات...' : 'اختر الفئة' },
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      navigate('/ar/admin/inventory');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ الصنف');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir="rtl" className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title={isEdit ? 'تعديل الصنف' : 'إضافة صنف جديد'}
        subtitle={isEdit ? 'تحديث بيانات صنف غذائي من MongoDB' : 'إضافة صنف غذائي جديد إلى المخزون'}
      />

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {message && <p className="mb-4 text-sm text-[#C0392B] text-right">{message}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Input label="اسم الصنف *" value={form.name} onChange={handleChange('name')} required className="text-right" />
              <Select options={categoryOptions} value={form.category} onChange={handleChange('category')} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="الكمية *" type="number" value={form.quantity} onChange={handleChange('quantity')} required className="text-right" />
                <Select options={unitOptions} value={form.unit} onChange={handleChange('unit')} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-right">المخزون والموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Input label="الحد الأدنى *" type="number" value={form.min_quantity} onChange={handleChange('min_quantity')} required className="text-right" />
              <Input label="تاريخ الصلاحية" type="date" value={form.expiry_date} onChange={handleChange('expiry_date')} className="text-right" />
              <Select
                options={[
                  { value: '', label: warehousesLoading ? 'جار تحميل المستودعات...' : warehousesError || 'اختر المستودع' },
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
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/ar/admin/inventory')}>
            <X className="w-4 h-4" />
            إلغاء
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'جار الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الصنف'}
          </Button>
        </div>
      </form>
    </div>
  );
};
