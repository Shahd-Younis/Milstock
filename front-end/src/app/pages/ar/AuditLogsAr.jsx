import { useState } from "react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Search, Download, Shield, User, Package, Settings, FileText } from "lucide-react";
const auditData = [
  { id: "AUD-001", action: "\u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644", module: "\u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629", performedBy: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u064A\u0648\u0633\u0641", role: "\u0645\u0633\u0624\u0648\u0644", ipAddress: "192.168.1.10", timestamp: "2026-05-05 08:32", status: "success", details: "\u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0646\u0627\u062C\u062D \u0645\u0646 \u0627\u0644\u062C\u0647\u0627\u0632 \u0627\u0644\u0631\u0626\u064A\u0633\u064A" },
  { id: "AUD-002", action: "\u062A\u0639\u062F\u064A\u0644 \u0635\u0646\u0641", module: "\u0627\u0644\u0645\u062E\u0632\u0648\u0646", performedBy: "\u0645\u0634\u0631\u0641 \u0627\u0644\u0645\u062E\u0632\u0646 \u0623\u062D\u0645\u062F", role: "\u0645\u0633\u062A\u0648\u062F\u0639", ipAddress: "192.168.1.22", timestamp: "2026-05-05 09:15", status: "success", details: "\u062A\u062D\u062F\u064A\u062B \u0643\u0645\u064A\u0629 INV-003 \u0645\u0646 4000 \u0625\u0644\u0649 5000" },
  { id: "AUD-003", action: "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0637\u0644\u0628", module: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", performedBy: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u064A\u0648\u0633\u0641", role: "\u0645\u0633\u0624\u0648\u0644", ipAddress: "192.168.1.10", timestamp: "2026-05-05 10:01", status: "success", details: "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 REQ-1233" },
  { id: "AUD-004", action: "\u0645\u062D\u0627\u0648\u0644\u0629 \u062F\u062E\u0648\u0644 \u0641\u0627\u0634\u0644\u0629", module: "\u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629", performedBy: "\u0645\u062C\u0647\u0648\u0644", role: "\u2014", ipAddress: "10.0.0.55", timestamp: "2026-05-04 23:14", status: "failed", details: "\u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062E\u0627\u0637\u0626\u0629 3 \u0645\u0631\u0627\u062A \u0645\u062A\u062A\u0627\u0644\u064A\u0629" },
  { id: "AUD-005", action: "\u062A\u0635\u062F\u064A\u0631 \u062A\u0642\u0631\u064A\u0631", module: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", performedBy: "\u0645\u062F\u064A\u0631\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0633\u0627\u0631\u0629", role: "\u0645\u0633\u0624\u0648\u0644", ipAddress: "192.168.1.15", timestamp: "2026-05-04 16:45", status: "success", details: "\u062A\u0635\u062F\u064A\u0631 \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0627\u0644\u0634\u0647\u0631\u064A PDF" },
  { id: "AUD-006", action: "\u062D\u0630\u0641 \u0645\u0633\u062A\u062E\u062F\u0645", module: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", performedBy: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u064A\u0648\u0633\u0641", role: "\u0645\u0633\u0624\u0648\u0644", ipAddress: "192.168.1.10", timestamp: "2026-05-04 14:20", status: "warning", details: "\u062D\u0630\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 USR-047" },
  { id: "AUD-007", action: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", module: "\u0627\u0644\u0646\u0638\u0627\u0645", performedBy: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u064A\u0648\u0633\u0641", role: "\u0645\u0633\u0624\u0648\u0644", ipAddress: "192.168.1.10", timestamp: "2026-05-03 11:00", status: "success", details: "\u062A\u0639\u062F\u064A\u0644 \u062D\u062F \u0627\u0644\u062A\u0646\u0628\u064A\u0647 \u0644\u0644\u0645\u062E\u0632\u0648\u0646 \u0627\u0644\u0645\u0646\u062E\u0641\u0636" }
];
const statusLabels = { success: "\u0646\u062C\u0627\u062D", failed: "\u0641\u0634\u0644", warning: "\u062A\u062D\u0630\u064A\u0631" };
const statusVariants = { success: "success", failed: "danger", warning: "warning" };
const moduleIcons = {
  "\u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629": Shield,
  "\u0627\u0644\u0645\u062E\u0632\u0648\u0646": Package,
  "\u0627\u0644\u0637\u0644\u0628\u0627\u062A": FileText,
  "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631": FileText,
  "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646": User,
  "\u0627\u0644\u0646\u0638\u0627\u0645": Settings
};
const AuditLogsAr = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = auditData.filter((log) => {
    const matchSearch = log.action.includes(searchTerm) || log.performedBy.includes(searchTerm) || log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = moduleFilter === "all" || log.module === moduleFilter;
    const matchStatus = statusFilter === "all" || log.status === statusFilter;
    return matchSearch && matchModule && matchStatus;
  });
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
    title="سجل العمليات"
    subtitle="مراجعة شاملة لجميع الأنشطة والعمليات على النظام"
  />

      {
    /* Summary stats */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
    { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u062C\u0644\u0627\u062A (24 \u0633\u0627\u0639\u0629)", value: auditData.length, color: "border-[#4B5B3A]/20 text-[#4B5B3A]" },
    { label: "\u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0646\u0627\u062C\u062D\u0629", value: auditData.filter((l) => l.status === "success").length, color: "border-[#5B8A4A]/20 text-[#5B8A4A]" },
    { label: "\u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0641\u0627\u0634\u0644\u0629", value: auditData.filter((l) => l.status === "failed").length, color: "border-[#D4183D]/15 text-[#D4183D]" },
    { label: "\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0623\u0645\u0646\u064A\u0629", value: auditData.filter((l) => l.module === "\u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629").length, color: "border-[#B8862A]/20 text-[#B8862A]" }
  ].map((stat) => <div key={stat.label} className={`p-5 rounded-2xl border bg-white ${stat.color} shadow-sm text-right`}>
            <p className="text-xs font-medium text-[#5A6B50] mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-[#2E3A24]">{stat.value}</p>
          </div>)}
      </div>

      {
    /* Filters */
  }
      <div className="bg-white rounded-2xl border border-[#4E4631]/10 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
    placeholder="ابحث في السجلات..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pr-12 text-right"
  />
          </div>
          <Select
    options={[
      { value: "all", label: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u062D\u062F\u0627\u062A" },
      { value: "\u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629", label: "\u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629" },
      { value: "\u0627\u0644\u0645\u062E\u0632\u0648\u0646", label: "\u0627\u0644\u0645\u062E\u0632\u0648\u0646" },
      { value: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", label: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A" },
      { value: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", label: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631" },
      { value: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646" },
      { value: "\u0627\u0644\u0646\u0638\u0627\u0645", label: "\u0627\u0644\u0646\u0638\u0627\u0645" }
    ]}
    value={moduleFilter}
    onChange={(e) => setModuleFilter(e.target.value)}
  />
          <Select
    options={[
      { value: "all", label: "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0627\u0644\u0627\u062A" },
      { value: "success", label: "\u0646\u062C\u0627\u062D" },
      { value: "failed", label: "\u0641\u0634\u0644" },
      { value: "warning", label: "\u062A\u062D\u0630\u064A\u0631" }
    ]}
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5A6B50]">
          عرض <span className="font-semibold text-[#2E3A24]">{filtered.length}</span> من {auditData.length} سجل
        </p>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          تصدير السجل
        </Button>
      </div>

      {
    /* Mobile cards */
  }
      <div className="lg:hidden space-y-3">
        {filtered.map((log) => {
    const Icon = moduleIcons[log.module] || Shield;
    return <div key={log.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={statusVariants[log.status]}>{statusLabels[log.status]}</Badge>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <p className="font-semibold text-foreground">{log.action}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-right mb-2">{log.details}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{log.timestamp}</span>
                <span>{log.performedBy} ({log.role})</span>
              </div>
            </div>;
  })}
      </div>

      {
    /* Desktop table */
  }
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {["\u0631\u0642\u0645 \u0627\u0644\u0633\u062C\u0644", "\u0627\u0644\u0625\u062C\u0631\u0627\u0621", "\u0627\u0644\u0648\u062D\u062F\u0629", "\u0645\u0646\u0641\u0651\u0630 \u0628\u0648\u0627\u0633\u0637\u0629", "\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629", "\u0639\u0646\u0648\u0627\u0646 IP", "\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0648\u0627\u0644\u0648\u0642\u062A", "\u0627\u0644\u062D\u0627\u0644\u0629"].map((h) => <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => {
    const Icon = moduleIcons[log.module] || Shield;
    return <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm">{log.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{log.action}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-row-reverse justify-end">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{log.module}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{log.performedBy}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.role}</td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.timestamp}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariants[log.status]}>{statusLabels[log.status]}</Badge></td>
                  </tr>;
  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export {
  AuditLogsAr
};
