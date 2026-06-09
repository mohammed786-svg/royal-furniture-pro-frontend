"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { useAuthStore } from "@/lib/store/auth-store";
import { useDeliveryStore } from "@/lib/store/delivery-store";
import { royalToast } from "@/lib/toast/royal-toast";

export function AccountSettingsContent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const pincode = useDeliveryStore((s) => s.pincode);

  const handleLogout = () => {
    logout();
    royalToast.success("Logged out");
    router.push("/");
  };

  return (
    <AccountShell
      title="Account Settings"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Account Settings" },
      ]}
    >
      <dl className="account-settings-dl">
        <div>
          <dt>Account</dt>
          <dd>{user?.name}</dd>
        </div>
        <div>
          <dt>Mobile</dt>
          <dd>+91 {user?.mobile}</dd>
        </div>
        <div>
          <dt>Default pincode</dt>
          <dd>
            {pincode}{" "}
            <span className="account-form__hint">(edit from header Deliver to)</span>
          </dd>
        </div>
      </dl>

      <div className="account-settings-actions">
        <Link href="/account/profile" className="account-quick-btn">
          Edit profile
        </Link>
        <button
          type="button"
          className="account-quick-btn account-quick-btn--danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </AccountShell>
  );
}
