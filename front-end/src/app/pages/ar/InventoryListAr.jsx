import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Trash2 } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Badge } from "../../components/Badge";
import { Table } from "../../components/Table";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";
import { formatDate, getProductStatus, uniqueOptions } from "../../lib/format";

const statusLabels = {
  "in-stock": "متوفر",
  "low-stock": "مخزون منخفض",
  "out-of-stock": "نفد المخزون",
  "expiring-soon": "ينتهي قريباً"
};

const variantMap = {
  "in-stock": "success",
  "low-stock": "warning",
  "out-of-stock": "danger",
  "expiring-soon": "warning"
};

const InventoryListAr = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: products, loading, error } = useApiResource(() => api.products.list(), []);

  const inventoryData = products.map((product) => {
    const status = getProductStatus(product);
    return {
      id: product._id.slice(-8).toUpperCase(),
      mongoId: product._id,
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      expirationDate: formatDate(product.expiry_date),
      warehouse: product.warehouse_id?.name || "غير محدد",
      status
    };
  });

  const filteredData = inventoryData.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(search) || item.id.toLowerCase().includes(search);
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    { key: "id", header: "رمز الصنف" },
    { key: "name", header: "اسم الصنف" },
    { key: "category", header: "الفئة" },
    { key: "quantity", header: "الكمية", render: (row) => `${row.quantity} ${row.unit}` },
    { key: "expirationDate", header: "تاريخ الصلاحية" },
    { key: "warehouse", header: "المستودع" },
    {
      key: "status",
      header: "الحالة",
      render: (row) => <Badge variant={variantMap[row.status]}>{statusLabels[row.status]}</Badge>
    },
    {
      key: "actions",
      header: "حذف",
      render: (row) => <button
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#D4183D] rounded-lg hover:bg-[#b81434] transition-colors"
        onClick={async (event) => {
          event.stopPropagation();
          if (!window.confirm(`Delete ${row.name}?`)) return;
          await api.products.remove(row.mongoId);
          window.location.reload();
        }}
      >
        <Trash2 className="w-3.5 h-3.5" />
        حذف
      </button>
    }
  ];

  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
    <PageHeaderAr
      title="إدارة المخزون"
      subtitle="نفس بيانات MongoDB المستخدمة في الواجهة الإنجليزية"
      action={{
        label: "إضافة صنف جديد",
        onClick: () => navigate("/ar/admin/inventory/add"),
        icon: Plus
      }}
    />

    <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B50]" />
          <Input
            placeholder="ابحث باسم الصنف أو الرمز..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pr-10 text-right"
          />
        </div>
        <Select
          options={uniqueOptions(products.map((product) => product.category), "جميع الفئات")}
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          disabled={loading}
        />
        <Select
          options={[
            { value: "all", label: "جميع الحالات" },
            { value: "in-stock", label: "متوفر" },
            { value: "low-stock", label: "مخزون منخفض" },
            { value: "expiring-soon", label: "ينتهي قريباً" },
            { value: "out-of-stock", label: "نفد المخزون" }
          ]}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        />
      </div>
    </div>

    <p className="text-sm text-[#5A6B50] text-right">
      {loading ? "جاري تحميل بيانات المخزون من MongoDB..." : error || `عرض ${filteredData.length} من ${inventoryData.length} صنف`}
    </p>

    <Table
      columns={columns}
      data={loading ? [] : filteredData}
      emptyMessage={error || "لا توجد منتجات في MongoDB. شغّل npm run seed."}
      onRowClick={(row) => navigate(`/ar/admin/inventory/${row.mongoId}`)}
      className="text-right"
    />
  </div>;
};

export {
  InventoryListAr
};
