import { useState } from "react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardContent } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Shield, User } from "lucide-react";
const users = [
  { id: "USR-001", name: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u064A\u0648\u0633\u0641 \u0627\u0644\u0631\u0627\u0634\u062F", email: "yousuf@milstock.local", role: "admin", kitchen: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646", status: "active", lastLogin: "2026-05-05 08:32", createdAt: "2025-01-15" },
  { id: "USR-002", name: "\u0645\u0634\u0631\u0641 \u0627\u0644\u0645\u062E\u0632\u0646 \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F", email: "ahmad@milstock.local", role: "warehouse", kitchen: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 A", status: "active", lastLogin: "2026-05-05 09:15", createdAt: "2025-03-10" },
  { id: "USR-003", name: "\u0645\u062F\u064A\u0631\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0633\u0627\u0631\u0629 \u062E\u0627\u0644\u062F", email: "sara@milstock.local", role: "admin", kitchen: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646", status: "active", lastLogin: "2026-05-04 16:45", createdAt: "2025-02-20" },
  { id: "USR-004", name: "\u0645\u0646\u0633\u0642 \u0627\u0644\u0645\u0637\u0628\u062E \u0645\u062D\u0645\u062F \u0639\u0644\u064A", email: "mohammed@milstock.local", role: "unit", kitchen: "\u0627\u0644\u0645\u0637\u0628\u062E \u0627\u0644\u0645\u0631\u0643\u0632\u064A", status: "active", lastLogin: "2026-05-04 14:20", createdAt: "2025-04-05" },
  { id: "USR-005", name: "\u0645\u0646\u0633\u0642 \u0627\u0644\u062A\u0648\u0631\u064A\u062F \u062E\u0627\u0644\u062F \u062F\u0627\u0648\u062F", email: "khaled@milstock.local", role: "unit", kitchen: "\u0645\u0637\u0628\u062E \u0627\u0644\u0645\u062E\u0628\u0648\u0632\u0627\u062A", status: "inactive", lastLogin: "2026-04-20 10:00", createdAt: "2025-05-01" },
  { id: "USR-006", name: "\u0645\u0634\u0631\u0641\u0629 \u0627\u0644\u0645\u062E\u0632\u0646 \u0641\u0627\u0637\u0645\u0629 \u0646\u0648\u0631", email: "fatima@milstock.local", role: "warehouse", kitchen: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 B", status: "suspended", lastLogin: "2026-03-15 08:00", createdAt: "2025-06-10" }
];
const roleLabels = { admin: "\u0645\u0633\u0624\u0648\u0644", warehouse: "\u0645\u0634\u0631\u0641 \u0645\u0633\u062A\u0648\u062F\u0639", kitchen: "\u0645\u0633\u062A\u062E\u062F\u0645 \u0648\u062D\u062F\u0629" };
const roleVariants = { admin: "danger", warehouse: "warning", kitchen: "info" };
const statusLabels = { active: "\u0646\u0634\u0637", inactive: "\u063A\u064A\u0631 \u0646\u0634\u0637", suspended: "\u0645\u0648\u0642\u0648\u0641" };
const statusVariants = { active: "success", inactive: "neutral", suspended: "danger" };
const UserManagementAr = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const filtered = users.filter((u) => {
    const matchSearch = u.name.includes(searchTerm) || u.email.includes(searchTerm) || u.kitchen.includes(searchTerm);
    const matchRole = selectedRole === "all" || u.role === selectedRole;
    return matchSearch && matchRole;
  });
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
    title="إدارة المستخدمين"
    subtitle="إنشاء وإدارة حسابات المستخدمين وصلاحياتهم"
    action={{ label: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u062E\u062F\u0645", onClick: () => {
    }, icon: Plus }}
  />

      {
    /* Summary */
  }
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
    { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", count: users.length, color: "bg-[#4B5B3A]" },
    { label: "\u0646\u0634\u0637", count: users.filter((u) => u.status === "active").length, color: "bg-[#6A7B4D]" },
    { label: "\u0645\u0648\u0642\u0648\u0641 / \u063A\u064A\u0631 \u0646\u0634\u0637", count: users.filter((u) => u.status !== "active").length, color: "bg-[#B85C50]" }
  ].map((s) => <Card key={s.label}>
            <CardContent className="pt-5 text-center">
              <div className={`${s.color} text-white text-2xl font-bold rounded-xl py-2 mb-2`}>{s.count}</div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>)}
      </div>

      {
    /* Filters */
  }
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
    placeholder="ابحث بالاسم، البريد، أو الوحدة..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pr-12 text-right"
  />
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {[
    { value: "all", label: "\u0627\u0644\u0643\u0644" },
    { value: "admin", label: "\u0645\u0633\u0624\u0648\u0644\u0648\u0646" },
    { value: "warehouse", label: "\u0645\u0634\u0631\u0641\u0648 \u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A" },
    { value: "kitchen", label: "\u0645\u0633\u062A\u062E\u062F\u0645\u0648 \u0627\u0644\u0648\u062D\u062F\u0627\u062A" }
  ].map((r) => <button
    key={r.value}
    onClick={() => setSelectedRole(r.value)}
    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${selectedRole === r.value ? "bg-[#4B5B3A] text-white" : "bg-card border border-border text-foreground hover:bg-muted"}`}
  >
              {r.label}
            </button>)}
        </div>
      </div>

      {
    /* Mobile cards */
  }
      <div className="lg:hidden space-y-3">
        {filtered.map((user) => <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Badge variant={roleVariants[user.role]}>{roleLabels[user.role]}</Badge>
                    <p className="font-semibold text-foreground">{user.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-[#4B5B3A] hover:bg-[#4B5B3A] hover:text-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={statusVariants[user.status]}>{statusLabels[user.status]}</Badge>
                <p className="text-xs text-muted-foreground">{user.kitchen}</p>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {
    /* Desktop table */
  }
      <div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {["\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645", "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A", "\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629", "\u0627\u0644\u0648\u062D\u062F\u0629", "\u0627\u0644\u062D\u0627\u0644\u0629", "\u0622\u062E\u0631 \u062F\u062E\u0648\u0644", "\u0625\u062C\u0631\u0627\u0621\u0627\u062A"].map((h) => <th key={h} className="px-4 py-3 text-sm font-medium text-muted-foreground">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 flex-row-reverse justify-end">
                    <div className="p-2 bg-[#4B5B3A] bg-opacity-10 rounded-xl">
                      {user.role === "admin" ? <Shield className="w-4 h-4 text-[#4B5B3A]" /> : <User className="w-4 h-4 text-[#4B5B3A]" />}
                    </div>
                    <p className="font-medium text-foreground">{user.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3"><Badge variant={roleVariants[user.role]}>{roleLabels[user.role]}</Badge></td>
                <td className="px-4 py-3 text-foreground">{user.kitchen}</td>
                <td className="px-4 py-3"><Badge variant={statusVariants[user.status]}>{statusLabels[user.status]}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.status === "active" ? <button className="p-1.5 text-[#C9A961] hover:bg-[#C9A961] hover:text-white rounded-lg transition-colors">
                        <UserX className="w-4 h-4" />
                      </button> : <button className="p-1.5 text-[#6A7B4D] hover:bg-[#6A7B4D] hover:text-white rounded-lg transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </button>}
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export {
  UserManagementAr
};
