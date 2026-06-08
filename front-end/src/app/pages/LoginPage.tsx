import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Shield, Lock, User, Globe, BarChart3 } from 'lucide-react';
import { api } from '../lib/api';
import { ApiOne, UserDoc } from '../lib/types';
import { BrandLogo } from '../components/BrandLogo';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = (await api.auth.login({ email, password })) as ApiOne<UserDoc> & { token: string };
      localStorage.setItem('milstock_token', response.token);
      localStorage.setItem('milstock_user', JSON.stringify(response.data));
      navigate(response.data.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#ECEEE2]">
      {/* Left panel â€” branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#2E3A24] p-12 flex-col justify-between relative overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#E0E1B7 1px, transparent 1px), linear-gradient(90deg, #E0E1B7 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Accent blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4B5B3A] rounded-full filter blur-3xl opacity-30 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6A7B4D] rounded-full filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          {/* Logo */}
          <BrandLogo className="mb-14" subtitle="Food Warehouse Operations" />

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Reliable Food Inventory Control for Warehouse Operations
            </h2>
            <p className="text-[#E0E1B7]/70 leading-relaxed">
              Secure, real-time tracking of food supplies across kitchens, suppliers, and warehouses.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { icon: Shield, label: 'Secure Access' },
              { icon: Lock, label: 'Role-Based Control' },
              { icon: BarChart3, label: 'Real-Time Analytics' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2">
                <Icon className="w-4 h-4 text-[#6A7B4D]" />
                <span className="text-sm text-[#E0E1B7]/80">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-xs text-[#E0E1B7]/40">Â© 2026 MilStock. All rights reserved.</p>
          <Link to="/ar/login" className="flex items-center gap-1.5 text-[#C9A961] hover:text-[#C9A961]/80 transition-colors text-sm">
            <Globe className="w-4 h-4" />
            Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©
          </Link>
        </div>
      </div>

      {/* Right panel â€” form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <BrandLogo
            className="mb-8 lg:hidden"
            subtitle="Food Inventory"
            textColor="text-[#2E3A24]"
            subtitleColor="text-[#5A6B50]"
          />

          <div className="mb-8">
            <h1 className="text-[#2E3A24] mb-2">Welcome Back</h1>
            <p className="text-sm text-[#5A6B50]">Sign in to access your food inventory dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && <p className="text-sm text-[#D4183D]">{error}</p>}
            <Input
              label="Email or Username"
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border border-[#4B5B3A]/30 accent-[#6A7B4D] cursor-pointer"
                />
                <span className="text-sm text-[#2E3A24]">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#6A7B4D] hover:text-[#4B5B3A] transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              <User className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In to MilStock'}
            </Button>

            {/* Demo credentials */}
            <div className="p-4 bg-[#6A7B4D]/8 rounded-xl border border-[#6A7B4D]/15">
              <p className="text-xs font-semibold text-[#4B5B3A] uppercase tracking-wide mb-2.5">Demo Credentials</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6B50]">Admin:</span>
                  <code className="bg-white px-2 py-0.5 rounded-lg text-[#2E3A24] border border-[#4E4631]/10">admin@milstock.local</code>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6B50]">Kitchen User:</span>
                  <code className="bg-white px-2 py-0.5 rounded-lg text-[#2E3A24] border border-[#4E4631]/10">kitchen@milstock.local</code>
                </div>
                <p className="text-xs text-[#5A6B50] mt-1.5">Password: Password123!</p>
              </div>
            </div>
          </form>

          {/* Language switch */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-[#5A6B50]" />
            <Link to="/ar/login" className="text-sm text-[#4B5B3A] hover:text-[#6A7B4D] font-medium transition-colors">
              Ø§Ù„ØªØ¨Ø¯ÙŠÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

