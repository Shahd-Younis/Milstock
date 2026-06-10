import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowRight, Save } from "lucide-react";
import { PageHeaderAr } from "../../components/ar/PageHeaderAr";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { api } from "../../lib/api";
import { useApiResource } from "../../lib/useApiResource";

const initialForm = { name: "", email: "", military_number: "", phone: "", role: "unit", status: "active" };

const EditUserAr = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: users, loading, error } = useApiResource(() => api.users.list(), []);
  const user = useMemo(() => users.find((entry) => entry._id === id), [id, users]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      military_number: user.military_number || "",
      phone: user.phone || "",
      role: user.role || "unit",
      status: user.status || "active"
    });
  }, [user]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.users.update(id, form);
      setMessageType("success");
      setMessage("تم تحديث المستخدم بنجاح.");
      window.setTimeout(() => navigate("/ar/admin/users", { state: { message: "تم تحديث المستخدم بنجاح." } }), 700);
    } catch (requestError) {
      setMessageType("error");
      setMessage(requestError.message || "تعذر تحديث المستخدم.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div dir="rtl" className="p-6 lg:p-8"><Card><CardContent className="py-10 text-center text-muted-foreground">جار تحميل المستخدم من MongoDB...</CardContent></Card></div>;
  if (error || !user) return <div dir="rtl" className="p-6 lg:p-8 space-y-6"><button onClick={() => navigate("/ar/admin/users")} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] text-sm"><ArrowRight className="w-4 h-4" />العودة إلى المستخدمين</button><Card><CardContent className="py-10 text-center text-muted-foreground">{error || "المستخدم غير موجود."}</CardContent></Card></div>;

  return <div dir="rtl" className="p-6 lg:p-8 space-y-6">
    <button onClick={() => navigate("/ar/admin/users")} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] text-sm"><ArrowRight className="w-4 h-4" />العودة إلى المستخدمين</button>
    <PageHeaderAr title="تعديل المستخدم" subtitle={user.email || id} />
    <Card className="max-w-3xl">
      <CardHeader><CardTitle className="text-right">معلومات المستخدم</CardTitle></CardHeader>
      <CardContent>
        {message && <div className={`mb-5 rounded-xl px-4 py-3 text-sm text-right ${messageType === "success" ? "border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 text-[#3d6b2e]" : "border border-[#D4183D]/20 bg-[#D4183D]/10 text-[#D4183D]"}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="الاسم" value={form.name} onChange={(event) => updateField("name", event.target.value)} required minLength={3} className="text-right" />
            <Input label="البريد الإلكتروني" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required className="text-right" />
            <Input label="كود الموظف" value={form.military_number} onChange={(event) => updateField("military_number", event.target.value)} required className="text-right" />
            <Input label="الهاتف" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required className="text-right" />
            <Select label="الدور" value={form.role} onChange={(event) => updateField("role", event.target.value)} options={[{ value: "unit", label: "مستخدم وحدة" }, { value: "admin", label: "مسؤول" }]} className="text-right" />
            <Select label="الحالة" value={form.status} onChange={(event) => updateField("status", event.target.value)} options={[{ value: "active", label: "نشط" }, { value: "inactive", label: "غير نشط" }]} className="text-right" />
          </div>
          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => navigate("/ar/admin/users")} disabled={saving}>إلغاء</Button><Button type="submit" disabled={saving}><Save className="w-4 h-4" />{saving ? "جار الحفظ..." : "حفظ التعديلات"}</Button></div>
        </form>
      </CardContent>
    </Card>
  </div>;
};

export {
  EditUserAr
};
