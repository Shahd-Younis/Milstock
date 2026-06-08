import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Search, Filter, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
const RequestsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: orders, loading: ordersLoading, error: ordersError } = useApiResource(() => api.orders.list(), []);
  const { data: orderItems, loading: itemsLoading } = useApiResource(() => api.orderItems.list(), []);
  const requestsData = useMemo(() => {
    return orders.map((order) => {
      const items = orderItems.filter((item) => item.order_id?._id === order._id);
      return {
        id: order._id.slice(-8).toUpperCase(),
        mongoId: order._id,
        kitchen: order.user_id?.military_number || order.user_id?.role || "Kitchen",
        item: items.map((item) => item.product_id?.name).filter(Boolean).join(", ") || "No items",
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        supplier: order.supplier_id?.name || "No supplier",
        status: order.status,
        requestedDate: new Date(order.date).toLocaleDateString(),
        requestedBy: order.user_id?.name || "Unknown"
      };
    });
  }, [orders, orderItems]);
  const filteredData = requestsData.filter((req) => {
    const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) || req.kitchen.toLowerCase().includes(searchTerm.toLowerCase()) || req.item.toLowerCase().includes(searchTerm.toLowerCase()) || req.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const columns = [
    { key: "id", header: "Request ID" },
    { key: "kitchen", header: "Kitchen" },
    { key: "item", header: "Item" },
    { key: "quantity", header: "Quantity" },
    { key: "supplier", header: "Supplier" },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const variantMap = {
          pending: "pending",
          approved: "success",
          completed: "info",
          cancelled: "danger"
        };
        return <Badge variant={variantMap[row.status]}>{row.status}</Badge>;
      }
    },
    { key: "requestedDate", header: "Date" },
    { key: "requestedBy", header: "Requested By" }
  ];
  const loading = ordersLoading || itemsLoading;
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
    title={isAdmin ? "All Supply Requests" : "My Requests"}
    subtitle={isAdmin ? "Review and manage supply requests from all kitchens" : "Track your supply request status"}
    action={!isAdmin ? {
      label: "New Request",
      onClick: () => navigate("/user/requests/create"),
      icon: Plus
    } : void 0}
  />

      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B50]" />
              <Input
    placeholder="Search by request ID, kitchen, item, or supplier..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
            </div>
          </div>
          <Select
    options={[
      { value: "all", label: "All Status" },
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" }
    ]}
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5A6B50]">
          {loading ? "Loading requests from MongoDB..." : ordersError || <>
                  Showing <span className="font-semibold text-[#2E3A24]">{filteredData.length}</span> of{" "}
                  {requestsData.length} requests
                </>}
        </p>
        <Button variant="outline" size="sm">
          <Filter className="w-3.5 h-3.5" />
          More Filters
        </Button>
      </div>

      <Table
    columns={columns}
    data={loading ? [] : filteredData}
    emptyMessage={ordersError || "No MongoDB orders found. Run npm run seed in the backend."}
    onRowClick={(row) => navigate(isAdmin ? `/admin/requests/${row.mongoId}` : `/user/requests/${row.mongoId}`)}
  />
    </div>;
};
export {
  RequestsList
};
