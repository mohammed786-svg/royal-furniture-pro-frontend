"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAdminAuthStore } from "@/lib/admin/auth-store";

export function AdminPasswordChange() {
  const changePassword = useAdminAuthStore((s) => s.changePassword);
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const result = await changePassword(currentPassword, newPassword);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.replace("/my-admin/login"), 1500);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="admin-profile-card">
      <div className="admin-profile-card-head">
        <h2>Change Password</h2>
        <p>Ensure your account stays secure with a strong password.</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="admin-profile-form-grid single">
          <PasswordField
            id="current-password"
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
          />
          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
          />
        </div>

        {error && <p className="admin-profile-error">{error}</p>}
        {success && (
          <p className="admin-profile-success">Password changed successfully</p>
        )}

        <div className="admin-profile-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="admin-profile-field">
      <label htmlFor={id}>{label}</label>
      <div className="admin-profile-password-wrap">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <button type="button" onClick={onToggle} aria-label={show ? "Hide" : "Show"}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
