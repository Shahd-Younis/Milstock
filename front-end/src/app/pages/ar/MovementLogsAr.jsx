import { useState } from "react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardContent } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { ExportCsvButton } from "../../components/ExportCsvButton";
import { Search, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
const logsData = [
  { id: "LOG-001", itemId: "INV-001", itemName: "\u0623\u0631\u0632", type: "in", quantity: 500, kitchen: "\u0635\u0646\u062F\u0648\u0642", from: "\u0627\u0644\u0645\u0648\u0631\u062F \u0627\u0644\u062E\u0627\u0631\u062C\u064A", to: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A", performedBy: "\u0645\u0634\u0631\u0641 \u0627\u0644\u0645\u062E\u0632\u0646 \u0623\u062D\u0645\u062F", date: "2026-05-04", notes: "\u0627\u0633\u062A\u0644\u0627\u0645 \u062F\u0648\u0631\u064A \u0634\u0647\u0631\u064A" },
  { id: "LOG-002", itemId: "INV-002", itemName: "\u062C\u0628\u0646", type: "out", quantity: 30, kitchen: "\u062D\u0642\u064A\u0628\u0629", from: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 B", to: "\u0627\u0644\u0645\u0637\u0628\u062E \u0627\u0644\u0645\u0631\u0643\u0632\u064A", performedBy: "\u0645\u0646\u0633\u0642 \u0627\u0644\u062A\u0648\u0631\u064A\u062F \u062E\u0627\u0644\u062F", date: "2026-05-03", notes: "\u062A\u0648\u0632\u064A\u0639 \u0639\u0644\u0649 \u0627\u0644\u0648\u062D\u062F\u0629" },
  { id: "LOG-003", itemId: "INV-003", itemName: "\u0632\u062C\u0627\u062C\u0627\u062A \u0645\u064A\u0627\u0647", type: "transfer", quantity: 1e3, kitchen: "\u0642\u0631\u0635", from: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A", to: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 C", performedBy: "\u0645\u0634\u0631\u0641\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0633\u0644\u0645\u0649", date: "2026-05-02", notes: "\u0646\u0642\u0644 \u0628\u0633\u0628\u0628 \u0627\u0643\u062A\u0638\u0627\u0638 \u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A" },
  { id: "LOG-004", itemId: "INV-001", itemName: "\u0623\u0631\u0632", type: "out", quantity: 200, kitchen: "\u0635\u0646\u062F\u0648\u0642", from: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A", to: "\u0645\u0637\u0628\u062E \u0627\u0644\u062E\u0636\u0631\u0648\u0627\u062A", performedBy: "\u0645\u0634\u0631\u0641\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0641\u0627\u0637\u0645\u0629", date: "2026-05-01", notes: "\u0637\u0644\u0628 \u0637\u0627\u0631\u0626" },
  { id: "LOG-005", itemId: "INV-006", itemName: "\u0641\u0627\u0635\u0648\u0644\u064A\u0627", type: "in", quantity: 150, kitchen: "\u0642\u0637\u0639\u0629", from: "\u0645\u0648\u0631\u062F \u0627\u0644\u0623\u063A\u0630\u064A\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A", to: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A", performedBy: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u064A\u0648\u0633\u0641", date: "2026-04-30", notes: "" }
];
const typeLabels = { in: "\u0648\u0627\u0631\u062F", out: "\u0635\u0627\u062F\u0631", transfer: "\u0646\u0642\u0644" };
const typeVariants = { in: "success", out: "danger", transfer: "info" };
const TypeIcon = ({ type }) => {
  if (type === "in") return <ArrowDownLeft className="w-4 h-4 text-[#6A7B4D]" />;
  if (type === "out") return <ArrowUpRight className="w-4 h-4 text-[#B85C50]" />;
  return <RefreshCw className="w-4 h-4 text-[#4B5B3A]" />;
};
const MovementLogsAr = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = logsData.filter((log) => {
    const search = String(searchTerm ?? "").toLowerCase();
    const matchSearch = String(log.itemName ?? "").toLowerCase().includes(search) || String(log.id ?? "").toLowerCase().includes(search);
    const matchType = typeFilter === "all" || log.type === typeFilter;
    return matchSearch && matchType;
  });
  const exportColumns = [
    { key: "id", header: "\u0631\u0642\u0645 \u0627\u0644\u0633\u062c\u0644" },
    { key: "itemId", header: "\u0631\u0645\u0632 \u0627\u0644\u0635\u0646\u0641" },
    { key: "itemName", header: "\u0627\u0644\u0635\u0646\u0641" },
    { header: "\u0627\u0644\u0646\u0648\u0639", value: (row) => typeLabels[row.type] || row.type },
    { key: "quantity", header: "\u0627\u0644\u0643\u0645\u064a\u0629" },
    { key: "kitchen", header: "\u0627\u0644\u0648\u062d\u062f\u0629" },
    { key: "from", header: "\u0645\u0646" },
    { key: "to", header: "\u0625\u0644\u0649" },
    { key: "performedBy", header: "\u0645\u0646\u0641\u0630 \u0628\u0648\u0627\u0633\u0637\u0629" },
    { key: "date", header: "\u0627\u0644\u062a\u0627\u0631\u064a\u062e" },
    { key: "notes", header: "\u0645\u0644\u0627\u062d\u0638\u0627\u062a" }
  ];
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
    title="سجل حركة المخزون"
    subtitle="تتبع جميع عمليات الوارد والصادر والنقل"
  />

      {
    /* Filters */
  }
      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
    placeholder="ابحث باسم الصنف أو رقم السجل..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pr-12 text-right"
  />
          </div>
          <Select
    options={[
      { value: "all", label: "\u062C\u0645\u064A\u0639 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u062D\u0631\u0643\u0629" },
      { value: "in", label: "\u0648\u0627\u0631\u062F" },
      { value: "out", label: "\u0635\u0627\u062F\u0631" },
      { value: "transfer", label: "\u0646\u0642\u0644 \u062F\u0627\u062E\u0644\u064A" }
    ]}
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
  />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          عرض {filtered.length} من {logsData.length} سجل
        </p>
        <ExportCsvButton filenamePrefix="movement-logs-export" columns={exportColumns} rows={filtered} className="flex items-center gap-2">
          {"\u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u0633\u062c\u0644"}
        </ExportCsvButton>
      </div>

      {
    /* Summary cards */
  }
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
    { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0648\u0627\u0631\u062F", count: logsData.filter((l) => l.type === "in").length, color: "bg-[#6A7B4D]" },
    { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0635\u0627\u062F\u0631", count: logsData.filter((l) => l.type === "out").length, color: "bg-[#B85C50]" },
    { label: "\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0646\u0642\u0644", count: logsData.filter((l) => l.type === "transfer").length, color: "bg-[#4B5B3A]" }
  ].map((s) => <Card key={s.label}>
            <CardContent className="pt-5 text-center">
              <div className={`${s.color} text-white text-2xl font-bold rounded-xl py-2 mb-2`}>{s.count}</div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>)}
      </div>

      {
    /* Mobile card list */
  }
      <div className="lg:hidden space-y-3">
        {filtered.map((log) => <div key={log.id} className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={typeVariants[log.type]}>{typeLabels[log.type]}</Badge>
              <div className="flex items-center gap-2 flex-row-reverse">
                <TypeIcon type={log.type} />
                <p className="font-semibold text-foreground text-right">{log.itemName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-right">
              <div><p className="text-muted-foreground">الكمية</p><p className="font-medium">{log.quantity} {log.kitchen}</p></div>
              <div><p className="text-muted-foreground">التاريخ</p><p className="font-medium">{log.date}</p></div>
              <div><p className="text-muted-foreground">من</p><p className="font-medium">{log.from}</p></div>
              <div><p className="text-muted-foreground">إلى</p><p className="font-medium">{log.to}</p></div>
            </div>
            {log.notes && <p className="text-xs text-muted-foreground mt-2 text-right">{log.notes}</p>}
          </div>)}
      </div>

      {
    /* Desktop table */
  }
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {["\u0631\u0642\u0645 \u0627\u0644\u0633\u062C\u0644", "\u0627\u0644\u0635\u0646\u0641", "\u0627\u0644\u0646\u0648\u0639", "\u0627\u0644\u0643\u0645\u064A\u0629", "\u0645\u0646", "\u0625\u0644\u0649", "\u0645\u0646\u0641\u0651\u0630 \u0628\u0648\u0627\u0633\u0637\u0629", "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"].map((h) => <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((log) => <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-mono text-sm font-medium">{log.id}</td>
                <td className="px-4 py-3 text-foreground">{log.itemName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-row-reverse justify-end">
                    <TypeIcon type={log.type} />
                    <Badge variant={typeVariants[log.type]}>{typeLabels[log.type]}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3">{log.quantity} {log.kitchen}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.from}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.to}</td>
                <td className="px-4 py-3 text-foreground">{log.performedBy}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.date}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export {
  MovementLogsAr
};

