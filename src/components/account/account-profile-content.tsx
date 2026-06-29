"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { useAuthStore } from "@/lib/store/auth-store";
import { royalToast } from "@/lib/toast/royal-toast";
import {
  formatIndianMobileDisplay,
  indianMobileError,
  isMissingCustomerMobile,
  normalizeIndianMobile,
} from "@/lib/validators/indian-mobile";
import { updateStorefrontProfile } from "@/services/storefront-commerce";

export function AccountProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectAfterSave = searchParams.get("redirect");
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [mobile, setMobile] = useState(
    user && !isMissingCustomerMobile(user.mobile)
      ? formatIndianMobileDisplay(user.mobile)
      : "",
  );
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      royalToast.error("Name is required");
      return;
    }

    const mobileError = indianMobileError(mobile);
    if (mobileError) {
      royalToast.error(mobileError);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateStorefrontProfile({
        fullName: name.trim(),
        email: email.trim() || undefined,
        mobile: normalizeIndianMobile(mobile),
      });

      setUser({
        customerId: updated.customerId,
        name: updated.name,
        mobile: updated.mobile,
        email: updated.email ?? undefined,
      });
      setName(updated.name);
      setEmail(updated.email ?? "");
      if (!isMissingCustomerMobile(updated.mobile)) {
        setMobile(formatIndianMobileDisplay(updated.mobile));
      }
      royalToast.success("Profile updated");
      if (redirectAfterSave && redirectAfterSave.startsWith("/")) {
        router.push(redirectAfterSave);
      }
    } catch (error) {
      royalToast.error(getApiErrorMessage(error, "Could not update profile"));
    } finally {
      setSaving(false);
    }
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
      {redirectAfterSave && isMissingCustomerMobile(user.mobile) ? (
        <p className="account-form__hint" style={{ marginBottom: "1rem" }}>
          Add your mobile number below to continue shopping and checkout.
        </p>
      ) : null}
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
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={mobile}
            onChange={(e) =>
              setMobile(
                formatIndianMobileDisplay(normalizeIndianMobile(e.target.value)),
              )
            }
            className="account-form__input"
            placeholder="10-digit mobile number"
            maxLength={11}
          />
          <p className="account-form__hint">
            Used for order updates and delivery. You can update this anytime.
          </p>
        </div>
        <div className="account-form__field">
          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="account-form__input"
            placeholder="you@example.com"
          />
          {user.email && (
            <p className="account-form__hint">
              Signed in with Google — email is linked to your account.
            </p>
          )}
        </div>
        <button type="submit" className="account-form__submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </AccountShell>
  );
}
