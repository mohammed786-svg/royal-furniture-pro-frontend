"use client";

import { useState } from "react";
import { AccountShell } from "@/components/account/account-shell";
import { useAuthStore } from "@/lib/store/auth-store";
import { royalToast } from "@/lib/toast/royal-toast";
import { formatIndianMobileDisplay } from "@/lib/validators/indian-mobile";

export function AccountProfileContent() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      royalToast.error("Name is required");
      return;
    }
    setUser({
      ...user,
      name: name.trim(),
      email: email.trim() || undefined,
    });
    royalToast.success("Profile updated");
  };

  return (
    <AccountShell
      title="My Profile"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "My Profile" },
      ]}
    >
      <form className="account-form" onSubmit={handleSave}>
        <div className="account-form__field">
          <label htmlFor="profile-name">Full name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="account-form__input"
          />
        </div>
        <div className="account-form__field">
          <label htmlFor="profile-mobile">Mobile</label>
          <input
            id="profile-mobile"
            type="text"
            value={formatIndianMobileDisplay(user.mobile)}
            className="account-form__input account-form__input--readonly"
            readOnly
          />
          <p className="account-form__hint">
            Mobile cannot be changed here. Contact support if needed.
          </p>
        </div>
        <div className="account-form__field">
          <label htmlFor="profile-email">Email (optional)</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="account-form__input"
            placeholder="you@example.com"
          />
        </div>
        <button type="submit" className="account-form__submit">
          Save changes
        </button>
      </form>
    </AccountShell>
  );
}
