import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Edit, Eye, KeyRound, MoreVertical, Plus, Power, Search, Trash2 } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ExportCsvButton } from "../../components/ExportCsvButton";
import { ActionsPortalMenu } from "../../components/ActionsPortalMenu";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";
import { formatDate } from "../../lib/format";
import { getAssignedWarehouseName } from "../../lib/warehouseDisplay";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("milstock_user") || "null");
  } catch {
    return null;
  }
};

const UserManagementAr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useMemo(getCurrentUser, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetUser, setResetUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const { data: users, loading, error } = useApiResource(() => api.users.list(), []);

  useEffect(() => {
    setRows(users.map((user) => ({ ...user, status: user.status || "active" })));
  }, [users]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setResetUser(null);
        setDeleteUser(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const filtered = rows.filter((user) => {
    const search = String(searchTerm ?? "").toLowerCase();
    return String(user.name ?? "").toLowerCase().includes(search) || String(user.email ?? "").toLowerCase().includes(search) || String(user.military_number ?? "").toLowerCase().includes(search);
  });
  const exportColumns = [
    { key: "military_number", header: "\u0643\u0648\u062f \u0627\u0644\u0645\u0648\u0638\u0641" },
    { key: "name", header: "\u0627\u0644\u0627\u0633\u0645" },
    { key: "email", header: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
    { header: "\u0627\u0644\u062f\u0648\u0631", value: (row) => row.role === "admin" ? "\u0645\u0633\u0624\u0648\u0644" : "\u0645\u0633\u062a\u062e\u062f\u0645 \u0648\u062d\u062f\u0629" },
    { header: "\u0627\u0644\u062d\u0627\u0644\u0629", value: (row) => (row.status || "active") === "active" ? "\u0646\u0634\u0637" : "\u063a\u064a\u0631 \u0646\u0634\u0637" },
    { header: "\u0627\u0644\u0645\u062e\u0632\u0646 \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0639\u0646\u0647", value: (row) => getAssignedWarehouseName(row, "\u0643\u0644 \u0627\u0644\u0645\u062e\u0627\u0632\u0646", "\u063a\u064a\u0631 \u0645\u062d\u062f\u062f") },
    { key: "phone", header: "\u0627\u0644\u0647\u0627\u062a\u0641" },
    { header: "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0646\u0634\u0627\u0621", value: (row) => formatDate(row.createdAt) }
  ];

  const showSuccess = (text) => {
    setErrorMessage("");
    setMessage(text);
  };
  const showError = (text) => {
    setMessage("");
    setErrorMessage(text);
  };

  const updateStatus = async (user) => {
    const nextStatus = (user.status || "active") === "active" ? "inactive" : "active";
    setBusyId(user._id);
    setOpenMenu(null);
    try {
      const response = await api.users.updateStatus(user._id, nextStatus);
      const updated = response?.data || response?.user || { ...user, status: nextStatus };
      setRows((current) => current.map((row) => row._id === user._id ? { ...row, ...updated, status: updated.status || nextStatus } : row));
      showSuccess(nextStatus === "active" ? "?? ????? ???????? ?????." : "?? ????? ???????? ?????.");
    } catch (requestError) {
      showError(requestError.message || "???? ????? ???? ????????.");
    } finally {
      setBusyId("");
    }
  };

  const resetPassword = async () => {
    if (!resetUser || newPassword.length < 8) {
      showError("???? ?????? ??? ?? ???? 8 ???? ??? ?????.");
      return;
    }
    setBusyId(resetUser._id);
    try {
      await api.users.resetPassword(resetUser._id, newPassword);
      setResetUser(null);
      setNewPassword("");
      showSuccess("?? ????? ????? ???? ?????? ?????.");
    } catch (requestError) {
      showError(requestError.message || "???? ????? ????? ???? ??????.");
    } finally {
      setBusyId("");
    }
  };

  const removeUser = async () => {
    if (!deleteUser) return;
    if (currentUser?._id && currentUser._id === deleteUser._id) {
      showError("?? ????? ??? ???? ??????? ??????.");
      setDeleteUser(null);
      return;
    }
    setBusyId(deleteUser._id);
    try {
      await api.users.remove(deleteUser._id);
      setRows((current) => current.filter((row) => row._id !== deleteUser._id));
      setDeleteUser(null);
      showSuccess("?? ??? ???????? ?????.");
    } catch (requestError) {
      showError(requestError.message || "???? ??? ????????.");
    } finally {
      setBusyId("");
    }
  };

  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
    <PageHeaderAr title="????? ??????????" subtitle="????? ?????? ?????????? ?????????? ?? MongoDB" action={{ label: "????? ??????", onClick: () => navigate("/ar/admin/users/new"), icon: Plus }} />
    {message && <div className="rounded-xl border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 px-4 py-3 text-sm text-[#3d6b2e] text-right">{message}</div>}
    {errorMessage && <div className="rounded-xl border border-[#D4183D]/20 bg-[#D4183D]/10 px-4 py-3 text-sm text-[#D4183D] text-right">{errorMessage}</div>}

    <div className="relative max-w-md">
      <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B50]" />
      <Input placeholder="???? ?? ??????????..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pr-10 text-right" />
    </div>

    <div className="flex justify-start">
      <ExportCsvButton filenamePrefix="users-export" columns={exportColumns} rows={loading ? [] : filtered}>
        {"\u062a\u0635\u062f\u064a\u0631"}
      </ExportCsvButton>
    </div>

    <p className="text-sm text-[#5A6B50] text-right">{loading ? "??? ????? ?????????? ?? MongoDB..." : error || `${filtered.length} ??????`}</p>

    <div className="overflow-x-auto rounded-2xl border border-[#4E4631]/10 bg-white">
      <table className="w-full text-right">
        <thead>
          <tr className="border-b border-[#4E4631]/10 bg-[#ECEEE2]/60">
            {["??? ??????", "?????", "?????? ??????????", "?????", "??????", "\u0627\u0644\u0645\u062e\u0632\u0646", "??????", "????? ???????", "???????"].map((header) => <th key={header} className="px-5 py-3.5 text-xs font-semibold text-[#5A6B50] uppercase tracking-wide">{header}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#4E4631]/6">
          {(loading ? [] : filtered).map((user) => <tr key={user._id} className="hover:bg-[#ECEEE2]/40 transition-colors">
            <td className="px-5 py-3.5 text-sm text-[#2E3A24]">{user.military_number || "??? ????"}</td>
            <td className="px-5 py-3.5 text-sm text-[#2E3A24] font-medium">{user.name || "??? ????"}</td>
            <td className="px-5 py-3.5 text-sm text-[#2E3A24]">{user.email || "??? ????"}</td>
            <td className="px-5 py-3.5"><Badge variant={user.role === "admin" ? "info" : "neutral"}>{user.role === "admin" ? "?????" : "?????? ????"}</Badge></td>
            <td className="px-5 py-3.5"><Badge variant={(user.status || "active") === "active" ? "success" : "neutral"}>{(user.status || "active") === "active" ? "???" : "??? ???"}</Badge></td>
            <td className="px-5 py-3.5 text-sm text-[#2E3A24]">{getAssignedWarehouseName(user, "\u0643\u0644 \u0627\u0644\u0645\u062e\u0627\u0632\u0646", "\u063a\u064a\u0631 \u0645\u062d\u062f\u062f")}</td>
            <td className="px-5 py-3.5 text-sm text-[#2E3A24]">{user.phone || "??? ????"}</td>
            <td className="px-5 py-3.5 text-sm text-[#2E3A24]">{formatDate(user.createdAt)}</td>
            <td className="px-5 py-3.5">
              <div className="relative inline-block" >
                <button type="button" aria-label="??? ?????????" disabled={busyId === user._id} onClick={(event) => { event.stopPropagation(); const rect = event.currentTarget.getBoundingClientRect(); setOpenMenu((current) => current?.id === user._id ? null : { id: user._id, row: user, rect }); }} className="p-2 hover:bg-[#E0E1B7] rounded-lg transition-colors disabled:opacity-50">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>)}
          {!loading && filtered.length === 0 && <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-[#5A6B50]">{error || "?? ???? ????????."}</td></tr>}
        </tbody>
      </table>
    </div>


    {openMenu && <ActionsPortalMenu
      rtl
      anchorRect={openMenu.rect}
      onClose={() => setOpenMenu(null)}
      items={[
        { label: "??? ????????", icon: Eye, action: () => navigate(`/ar/admin/users/${openMenu.row._id}`) },
        { label: "????? ????????", icon: Edit, action: () => navigate(`/ar/admin/users/${openMenu.row._id}/edit`) },
        { label: (openMenu.row.status || "active") === "active" ? "????? ????????" : "????? ????????", icon: Power, action: () => updateStatus(openMenu.row) },
        { label: "????? ????? ???? ??????", icon: KeyRound, action: () => { setResetUser(openMenu.row); setNewPassword(""); } },
        { label: "??? ????????", icon: Trash2, danger: true, action: () => setDeleteUser(openMenu.row) }
      ]}
    />}`r`n    {resetUser && <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#4E4631]/10 shadow-xl p-6 text-right">
        <h3 className="text-[#2E3A24] font-semibold mb-2">????? ????? ???? ??????</h3>
        <p className="text-sm text-[#5A6B50] mb-4">???? ???? ???? ????? ???????? {resetUser.name || ""}.</p>
        <Input label="???? ?????? ???????" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} className="text-right" />
        <div className="flex justify-end gap-3 mt-5"><Button variant="outline" type="button" onClick={() => setResetUser(null)} disabled={busyId === resetUser._id}>?????</Button><Button type="button" onClick={resetPassword} disabled={busyId === resetUser._id}>{busyId === resetUser._id ? "??? ?????..." : "??? ???? ??????"}</Button></div>
      </div>
    </div>}

    {deleteUser && <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#4E4631]/10 shadow-xl p-6 text-right">
        <h3 className="text-[#2E3A24] font-semibold mb-2">??? ????????</h3>
        <p className="text-sm text-[#5A6B50] mb-5">?? ???? ??? {deleteUser.name || "??? ????????"}? ?? ???? ??????? ?? ??? ???????.</p>
        <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setDeleteUser(null)} disabled={busyId === deleteUser._id}>?????</Button><Button variant="danger" type="button" onClick={removeUser} disabled={busyId === deleteUser._id}>{busyId === deleteUser._id ? "??? ?????..." : "??? ????????"}</Button></div>
      </div>
    </div>}
  </div>;
};

export {
  UserManagementAr
};

