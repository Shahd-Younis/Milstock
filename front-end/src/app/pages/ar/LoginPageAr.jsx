import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, Globe } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../lib/api";
import { BrandLogo } from "../../components/BrandLogo";
import { getRoleHomePath } from "../../lib/auth";

const LoginPageAr = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@milstock.local");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === "testadmin@milstock.local" && password === "123") {
      const testUser = {
        _id: "frontend-test-admin",
        name: "Frontend Test Admin",
        email: "testadmin@milstock.local",
        phone: "",
        military_number: "TEST-ADMIN",
        role: "admin",
      };
      localStorage.setItem("milstock_token", "frontend-test-admin-token");
      localStorage.setItem("milstock_user", JSON.stringify(testUser));
      navigate("/ar/admin/dashboard", { replace: true });
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.login({ email, password });
      localStorage.setItem("milstock_token", response.token);
      const user = response.user || response.data;
      localStorage.setItem("milstock_user", JSON.stringify(user));
      navigate(getRoleHomePath(user?.role, true), { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return <div dir="rtl" className="min-h-screen bg-[#F6F3E7] flex">
    <div className="hidden lg:flex flex-1 bg-[#2E3A24] text-white p-12 flex-col justify-between">
      <BrandLogo subtitle="إدارة مستودعات الأغذية" className="flex-row-reverse text-right" />
      <div className="max-w-lg space-y-4">
        <h1 className="text-4xl font-bold leading-tight">إدارة مخزون غذائي ذكية وموثوقة</h1>
        <p className="text-[#E0E1B7] leading-8">
          تابع الأصناف والطلبات وحركة المخزون عبر المطابخ والموردين والمخازن في نظام واحد.
        </p>
      </div>
      <div className="flex items-center justify-between text-xs text-[#E0E1B7]/60">
        <p>© 2026 MilStock</p>
        <Link to="/login" className="flex items-center gap-1.5 text-[#C9A961] hover:text-[#C9A961]/80 transition-colors text-sm">
          <Globe className="w-4 h-4" />
          English
        </Link>
      </div>
    </div>

    <div className="w-full lg:w-[480px] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#4E4631]/10 rounded-2xl shadow-sm p-8">
        <div className="mb-8 text-right">
          <div className="w-12 h-12 rounded-xl bg-[#4B5B3A] flex items-center justify-center mb-4 mr-0">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#2E3A24]">تسجيل الدخول</h2>
          <p className="text-sm text-[#5A6B50] mt-2">ادخل إلى نظام إدارة مخزون الأغذية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="text-right"
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="text-right"
          />
          {error && <p className="text-sm text-[#D4183D]">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            <Mail className="w-5 h-5" />
            {loading ? "جاري تسجيل الدخول..." : "دخول"}
          </Button>
        </form>

        <div className="mt-6 rounded-xl bg-[#F6F3E7] p-4 text-sm text-[#5A6B50] space-y-2">
          <p className="font-semibold text-[#2E3A24]">حسابات تجريبية</p>
          <p>admin@milstock.local</p>
          <p>kitchen@milstock.local</p>
          <p>testadmin@milstock.local</p>
          <p>كلمة المرور: Password123!</p>
          <p>كلمة مرور الاختبار: 123</p>
        </div>

        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-[#4B5B3A]">
          <Globe className="w-4 h-4" />
          التبديل إلى الإنجليزية
        </Link>
      </div>
    </div>
  </div>;
};

export {
  LoginPageAr
};
