import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { StatCardAr } from "../../components/ar/StatCardAr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { MapPin, Package, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";

const WarehouseLocationsAr = () => {
  const { data: warehouses, loading: warehousesLoading, error: warehousesError } = useApiResource(() => api.warehouses.list(), []);
  const { data: products } = useApiResource(() => api.products.list(), []);

  const warehouseCards = warehouses.map((warehouse) => {
    const warehouseProducts = products.filter((product) => product.warehouse_id?._id === warehouse._id);
    const used = warehouseProducts.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
    const capacity = Math.max(used + 1000, 5000);
    const usagePercent = Math.round(used / capacity * 100);
    return {
      id: warehouse._id,
      name: warehouse.name,
      location: warehouse.location,
      manager: warehouse.user_id?.name || "غير محدد",
      used,
      capacity,
      usagePercent,
      categories: Array.from(new Set(warehouseProducts.map((product) => product.category).filter(Boolean))),
      status: usagePercent >= 95 ? "full" : "operational"
    };
  });

  const total = warehouseCards.reduce((sum, warehouse) => sum + warehouse.capacity, 0);
  const totalUsed = warehouseCards.reduce((sum, warehouse) => sum + warehouse.used, 0);
  const operational = warehouseCards.filter((warehouse) => warehouse.status === "operational").length;

  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
    <PageHeaderAr
      title="مواقع التخزين"
      subtitle="نفس مستودعات MongoDB المستخدمة في الواجهة الإنجليزية"
      action={{ label: "إضافة مستودع", onClick: () => {}, icon: Plus }}
    />

    <p className="text-sm text-[#5A6B50] text-right">
      {warehousesLoading ? "جاري تحميل المستودعات من MongoDB..." : warehousesError || `${warehouseCards.length} مستودعات محملة`}
    </p>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCardAr title="إجمالي المستودعات" value={warehouseCards.length} icon={MapPin} color="primary" />
      <StatCardAr title="مستودعات تشغيلية" value={operational} icon={CheckCircle} color="success" />
      <StatCardAr title="إجمالي السعة" value={`${(total / 1000).toFixed(0)}k`} icon={Package} color="primary" />
      <StatCardAr
        title="نسبة الإشغال"
        value={`${total ? Math.round(totalUsed / total * 100) : 0}%`}
        icon={AlertTriangle}
        trend={{ value: `${totalUsed} من ${total}`, isPositive: true }}
        color="warning"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {warehouseCards.map((warehouse) => {
        const barColor = warehouse.usagePercent >= 95 ? "#D4183D" : warehouse.usagePercent >= 80 ? "#C9A961" : "#6A7B4D";
        return <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="text-right">
              <CardTitle>{warehouse.name}</CardTitle>
              <div className="flex items-center gap-1 mt-1 flex-row-reverse justify-end">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{warehouse.location}</p>
              </div>
            </div>
            <Badge variant={warehouse.status === "full" ? "danger" : "success"}>
              {warehouse.status === "full" ? "ممتلئ" : "تشغيلي"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">{warehouse.used.toLocaleString()} / {warehouse.capacity.toLocaleString()}</span>
                <span className="font-medium text-foreground">نسبة الإشغال: {warehouse.usagePercent}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="h-3 rounded-full transition-all" style={{ width: `${warehouse.usagePercent}%`, backgroundColor: barColor }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-right">
              <div>
                <p className="text-muted-foreground text-xs mb-1">مدير المستودع</p>
                <p className="font-medium text-foreground">{warehouse.manager}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">عدد الأصناف</p>
                <p className="font-medium text-foreground">{warehouse.categories.length}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-2">فئات المخزون</p>
                <div className="flex flex-wrap gap-2 justify-end">
                  {(warehouse.categories.length ? warehouse.categories : ["لا توجد أصناف"]).map((category) => <span
                    key={category}
                    className="px-2 py-1 text-xs bg-[#4B5B3A] bg-opacity-10 text-[#4B5B3A] rounded-lg border border-[#4B5B3A] border-opacity-20"
                  >
                    {category}
                  </span>)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>;
      })}
    </div>
  </div>;
};

export {
  WarehouseLocationsAr
};
