import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { ExportCsvButton } from "../components/ExportCsvButton";
import { Search } from "lucide-react";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
import { formatDate } from "../lib/format";
const MovementLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const { data: movements, loading, error } = useApiResource(() => api.inventory.list(), []);
  const movementData = movements.map((movement) => ({
    id: movement._id.slice(-8).toUpperCase(),
    date: formatDate(movement.createdAt),
    itemId: movement.product_id?._id?.slice(-8).toUpperCase() || "N/A",
    itemName: movement.product_id?.name || "Unknown product",
    action: movement.change_type,
    quantity: `${movement.change_type === "in" ? "+" : "-"}${movement.stock}`,
    location: movement.reference_id?.name || "No warehouse",
    user: movement.user_id?.name || "Unknown user",
    reason: movement.reference_type || "Inventory movement"
  }));
  const filteredData = movementData.filter((movement) => {
    const search = String(searchTerm ?? "").toLowerCase();
    const matchesSearch = String(movement.id ?? "").toLowerCase().includes(search) || String(movement.itemName ?? "").toLowerCase().includes(search) || String(movement.itemId ?? "").toLowerCase().includes(search);
    const matchesAction = actionFilter === "all" || movement.action === actionFilter;
    return matchesSearch && matchesAction;
  });
  const columns = [
    { key: "id", header: "Movement ID" },
    { key: "date", header: "Date" },
    {
      key: "item",
      header: "Item",
      render: (row) => <div>
          <p className="font-medium text-foreground">{row.itemName}</p>
          <p className="text-sm text-muted-foreground">{row.itemId}</p>
        </div>
    },
    {
      key: "action",
      header: "Action",
      render: (row) => <Badge variant={row.action === "in" ? "success" : "warning"}>
          {row.action === "in" ? "Stock In" : "Stock Out"}
        </Badge>
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (row) => <span className={`font-semibold ${row.action === "in" ? "text-[#6A7B4D]" : "text-[#B85C50]"}`}>
          {row.quantity}
        </span>
    },
    { key: "location", header: "Warehouse" },
    { key: "user", header: "Performed By" },
    { key: "reason", header: "Reference" }
  ];
  const exportColumns = [
    { key: "id", header: "Movement ID" },
    { key: "date", header: "Date" },
    { key: "itemId", header: "Item ID" },
    { key: "itemName", header: "Item Name" },
    { key: "action", header: "Action" },
    { key: "quantity", header: "Quantity" },
    { key: "location", header: "Warehouse" },
    { key: "user", header: "Performed By" },
    { key: "reason", header: "Reference" }
  ];
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader title="Inventory Movement Logs" subtitle="Complete history of all inventory transactions" />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
    placeholder="Search by movement ID, item name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-12"
  />
          </div>
        </div>
        <Select
    options={[
      { value: "all", label: "All Actions" },
      { value: "in", label: "Stock In" },
      { value: "out", label: "Stock Out" }
    ]}
    value={actionFilter}
    onChange={(e) => setActionFilter(e.target.value)}
  />
        <Input type="date" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          {loading ? "Loading movement logs from MongoDB..." : error || `Showing ${filteredData.length} of ${movementData.length} movements`}
        </p>
        <ExportCsvButton filenamePrefix="movement-logs-export" columns={exportColumns} rows={loading ? [] : filteredData}>
          Export Logs
        </ExportCsvButton>
      </div>

      <Table
    columns={columns}
    data={loading ? [] : filteredData}
    emptyMessage={error || "No MongoDB inventory movements found. Run npm run seed in the backend."}
  />
    </div>;
};
export {
  MovementLogs
};
