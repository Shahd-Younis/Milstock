import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { Calendar, AlertTriangle, Clock } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { api } from "../lib/api";
import { useApiResource } from "../lib/useApiResource";
import { formatDate } from "../lib/format";
const daysUntil = (date) => {
  if (!date) return Number.POSITIVE_INFINITY;
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
};
const ExpirationMonitor = () => {
  const { data: products, loading, error } = useApiResource(() => api.products.list(), []);
  const expiringItems = products.filter((product) => product.expiry_date).map((product) => {
    const daysRemaining = daysUntil(product.expiry_date);
    const settings = product.alert_settings || {};
    const warningDays = Number(settings.expiration_warning_days ?? 30);
    const criticalDays = Number(settings.critical_expiration_days ?? 7);
    return {
      id: product._id.slice(-8).toUpperCase(),
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      expirationDate: formatDate(product.expiry_date),
      daysRemaining,
      warehouse: product.warehouse_id?.name || "Unassigned",
      severity: daysRemaining <= criticalDays ? "critical" : daysRemaining <= warningDays ? "warning" : "normal"
    };
  }).filter((item) => item.severity !== "normal").sort((a, b) => a.daysRemaining - b.daysRemaining);
  const criticalItems = expiringItems.filter((item) => item.severity === "critical");
  const warningItems = expiringItems.filter((item) => item.severity === "warning");
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
    {
      key: "daysRemaining",
      header: "Days Remaining",
      render: (row) => {
        const color = row.severity === "critical" ? "text-destructive" : row.severity === "warning" ? "text-[#C9A961]" : "text-foreground";
        return <span className={`font-semibold ${color}`}>{row.daysRemaining} days</span>;
      }
    },
    { key: "warehouse", header: "Warehouse" },
    {
      key: "severity",
      header: "Status",
      render: (row) => {
        const variantMap = {
          critical: "danger",
          warning: "warning",
          normal: "success"
        };
        return <Badge variant={variantMap[row.severity]}>{row.severity}</Badge>;
      }
    }
  ];
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader title="Expiration Monitoring" subtitle="Track MongoDB products approaching expiration dates" />

      <p className="text-sm text-[#5A6B50]">
        {loading ? "Loading expiration data from MongoDB..." : error || `${expiringItems.length} monitored products loaded`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Expiring Within 7 Days" value={criticalItems.length.toString()} icon={AlertTriangle} color="danger" />
        <StatCard title="Expiring Within 30 Days" value={warningItems.length.toString()} icon={Clock} color="warning" />
        <StatCard title="Total Monitored Items" value={expiringItems.length.toString()} icon={Calendar} color="primary" />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <CardTitle>Critical - Expiring Within 7 Days</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table columns={columns} data={loading ? [] : criticalItems} emptyMessage={error || "No critical expiring MongoDB products."} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Monitored Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table columns={columns} data={loading ? [] : expiringItems} emptyMessage={error || "No expiring MongoDB products found."} />
          </CardContent>
        </Card>
      </div>
    </div>;
};
export {
  ExpirationMonitor
};
