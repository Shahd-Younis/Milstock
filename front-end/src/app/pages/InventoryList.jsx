import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Plus, Search, Filter, Download, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
import { formatDate, getProductStatus, uniqueOptions } from "../lib/format";
const InventoryList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: products, loading, error } = useApiResource(() => api.products.list(), []);
  const inventoryData = products.map((product) => ({
    id: product._id.slice(-8).toUpperCase(),
    mongoId: product._id,
    name: product.name,
    category: product.category,
    quantity: product.quantity,
    unit: product.unit,
    expirationDate: formatDate(product.expiry_date),
    warehouse: product.warehouse_id?.name || "Unassigned",
    status: getProductStatus(product)
  }));
  const filteredData = inventoryData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const columns = [
    { key: "id", header: "Item ID" },
    { key: "name", header: "Item Name" },
    { key: "category", header: "Category" },
    {
      key: "quantity",
      header: "Quantity",
      render: (row) => `${row.quantity} ${row.unit}`
    },
    { key: "expirationDate", header: "Expiration Date" },
    { key: "warehouse", header: "Warehouse" },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const variantMap = {
          "in-stock": "success",
          "low-stock": "warning",
          "out-of-stock": "danger",
          "expiring-soon": "warning"
        };
        return <Badge variant={variantMap[row.status]}>{row.status.replace("-", " ")}</Badge>;
      }
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => <button
        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#D4183D] rounded-lg hover:bg-[#b81434] transition-colors"
        onClick={async (event) => {
          event.stopPropagation();
          if (!window.confirm(`Delete ${row.name}?`)) return;
          await api.products.remove(row.mongoId);
          window.location.reload();
        }}
      >
          Delete
        </button>
    }
  ];
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
    title="Inventory Management"
    subtitle="Track and manage all inventory items across warehouses"
    action={{
      label: "Add New Item",
      onClick: () => navigate("/admin/inventory/add"),
      icon: Plus
    }}
  />

      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B50]" />
              <Input
    placeholder="Search by item name or ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
            </div>
          </div>
          <Select
    options={uniqueOptions(products.map((product) => product.category), "All Categories")}
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    disabled={loading}
  />
          <Select
    options={[
      { value: "all", label: "All Status" },
      { value: "in-stock", label: "In Stock" },
      { value: "low-stock", label: "Low Stock" },
      { value: "expiring-soon", label: "Expiring Soon" },
      { value: "out-of-stock", label: "Out of Stock" }
    ]}
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5A6B50]">
          {loading ? "Loading inventory from MongoDB..." : error || <>
                  Showing <span className="font-semibold text-[#2E3A24]">{filteredData.length}</span> of{" "}
                  {inventoryData.length} items
                </>}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      <Table
    columns={columns}
    data={loading ? [] : filteredData}
    emptyMessage={error || "No MongoDB products found. Run npm run seed in the backend."}
    onRowClick={(row) => navigate(`/admin/inventory/${row.mongoId}`)}
  />
    </div>;
};
export {
  InventoryList
};
