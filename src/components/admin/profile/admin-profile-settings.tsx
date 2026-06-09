"use client";

import { useEffect, useState } from "react";
import { useAdminAuthStore } from "@/lib/admin/auth-store";

export function AdminProfileSettings() {
  const user = useAdminAuthStore((s) => s.user);
  const updateProfile = useAdminAuthStore((s) => s.updateProfile);

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.fullName, user?.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    await updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-profile-card">
      <div className="admin-profile-card-head">
        <h2>Profile Information</h2>
        <p>Update your account profile details.</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="admin-profile-form-grid">
          <div className="admin-profile-field">
            <label htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="admin-profile-field">
            <label htmlFor="profile-email">Email Address</label>
            <input
              id="profile-email"
              type="email"
              value={user?.email ?? ""}
              disabled
              className="disabled"
            />
            <span className="admin-profile-hint">Email cannot be changed</span>
          </div>
          <div className="admin-profile-field">
            <label htmlFor="profile-phone">Phone Number</label>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="admin-profile-field">
            <label htmlFor="profile-role">Role</label>
            <input
              id="profile-role"
              type="text"
              value={user?.roleName ?? ""}
              disabled
              className="disabled"
            />
          </div>
        </div>

        <div className="admin-profile-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary">
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-[var(--admin-success)]">
              Profile updated successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
