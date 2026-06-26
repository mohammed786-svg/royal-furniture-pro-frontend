"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { siteConfig } from "@/config/seo/metadata.config";
import { useAdminAuthStore } from "@/lib/admin/auth-store";

export function AdminLoginForm() {
  const router = useRouter();
  const login = useAdminAuthStore((s) => s.login);
  const isHydrated = useAdminAuthStore((s) => s.isHydrated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isHydrated) return;

    setLoading(true);
    const result = await login(email.trim(), password, remember);
    setLoading(false);
    if (result.ok) {
      router.replace("/my-admin/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-logo">
        <Image
          src={siteConfig.logoSrc}
          alt={siteConfig.name}
          width={220}
          height={94}
          className="admin-login-logo__image"
          priority
        />
      </div>

      <div className="admin-login-card">
        <h1>Welcome</h1>
        <p className="subtitle">Please enter your details to sign in</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Email Address</label>
            <div className="admin-input-wrap">
              <input
                id="admin-email"
                type="email"
                placeholder="admin@royalfurniture.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Mail size={18} className="admin-input-icon" />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-input-icon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="admin-form-row">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember Me
            </label>
            <Link href="#" className="admin-forgot">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="admin-signin-btn"
            disabled={loading || !isHydrated}
          >
            {!isHydrated ? "Loading..." : loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="admin-login-footer">
          Super Admin: super@royal.com · Admin: admin@royal.com
        </p>
      </div>

      <p className="admin-copyright">
        Copyright &copy; {new Date().getFullYear()} — Royal Furniture Pro
      </p>
    </div>
  );
}
