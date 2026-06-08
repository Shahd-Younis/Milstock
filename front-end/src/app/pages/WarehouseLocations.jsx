import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Badge } from "../components/Badge";
import { MapPin, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
const WarehouseLocations = () => {
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useApiResource(() => api.warehouses.list(), []);
  const { data: stockRows, loading: stockLoading } = useApiResource(() => api.productWarehouses.list(), []);
  const warehouseCards = warehouses.map((warehouse) => {
    const rows = stockRows.filter((row) => row.warehouse_id?._id === warehouse._id);
    const currentStock = rows.reduce((sum, row) => sum + row.quantity, 0);
    const categoryTotals = rows.reduce((totals, row) => {
      const category = row.product_id?.category || "Uncategorized";
      totals[category] = (totals[category] || 0) + row.quantity;
      return totals;
    }, {});
    const categories = Object.entries(categoryTotals).map(([name, items]) => ({
      name,
      items,
      percentage: currentStock ? Math.round(items / currentStock * 100) : 0
    }));
    return {
      ...warehouse,
      capacity: Math.max(currentStock + 1e3, 5e3),
      currentStock,
      sections: Math.max(categories.length, 1),
      categories,
      status: "operational",
      alerts: rows.filter((row) => {
        const product = row.product_id;
        return product ? product.quantity <= product.min_quantity : false;
      }).length
    };
  });
  const loading = warehousesLoading || stockLoading;
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader title="Warehouse Locations" subtitle="Monitor storage facilities and capacity utilization" />

      <p className="text-sm text-[#5A6B50]">
        {loading ? "Loading warehouses from MongoDB..." : warehousesError || `${warehouseCards.length} warehouses loaded`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {!loading && warehouseCards.map((warehouse) => {
    const utilizationPercentage = Math.round(warehouse.currentStock / warehouse.capacity * 100);
    const isHighUtilization = utilizationPercentage > 80;
    return <Card key={warehouse._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{warehouse.location}</p>
                      </div>
                    </div>
                    {warehouse.alerts > 0 && <Badge variant="warning" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {warehouse.alerts}
                      </Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Capacity Utilization</span>
                        <span className={`font-semibold ${isHighUtilization ? "text-[#C9A961]" : "text-[#6A7B4D]"}`}>
                          {utilizationPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#E0E1B7] rounded-full overflow-hidden">
                        <div
      className={`h-full rounded-full transition-all ${isHighUtilization ? "bg-[#C9A961]" : "bg-[#6A7B4D]"}`}
      style={{ width: `${utilizationPercentage}%` }}
    />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {warehouse.currentStock.toLocaleString()} / {warehouse.capacity.toLocaleString()} items
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Stored Categories</p>
                        <p className="text-xl font-bold text-foreground">{warehouse.sections}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Manager</p>
                        <p className="text-sm text-foreground">{warehouse.user_id?.name || "Unassigned"}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-3">Stock Distribution</p>
                      <div className="space-y-2">
                        {warehouse.categories.length === 0 && <p className="text-xs text-muted-foreground">No product stock rows yet.</p>}
                        {warehouse.categories.map((category) => <div key={category.name}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{category.name}</span>
                              <span className="text-foreground font-medium">
                                {category.items} ({category.percentage}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#E0E1B7] rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${category.percentage}%` }} />
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>;
  })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-[#4B5B3A] bg-opacity-10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total Warehouses</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{warehouseCards.length}</p>
            </div>
            <div className="p-5 bg-[#6A7B4D] bg-opacity-10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-[#6A7B4D]" />
                <p className="text-sm text-muted-foreground">Total Capacity</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {warehouseCards.reduce((sum, wh) => sum + wh.capacity, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-5 bg-[#6A7B4D] bg-opacity-10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-[#6A7B4D]" />
                <p className="text-sm text-muted-foreground">Current Stock</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {warehouseCards.reduce((sum, wh) => sum + wh.currentStock, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-5 bg-[#C9A961] bg-opacity-10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#C9A961]" />
                <p className="text-sm text-muted-foreground">Active Alerts</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {warehouseCards.reduce((sum, wh) => sum + wh.alerts, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export {
  WarehouseLocations
};
