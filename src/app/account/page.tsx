"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PasswordRequirements from "@/components/auth/PasswordRequirements";

export default function AccountPage() {
  const { user, refreshUser } = useAuth();

  // Name form state
  const [name, setName] = useState(user?.name ?? "");
  const [nameMessage, setNameMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  async function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    setNameError("");
    setNameMessage("");
    setNameSaving(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNameError(data.error || "Failed to update name");
        return;
      }

      setNameMessage("Name updated");
      await refreshUser();
    } catch {
      setNameError("Something went wrong");
    } finally {
      setNameSaving(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwMessage("");

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }

    setPwSaving(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPwError(data.error || "Failed to change password");
        return;
      }

      setPwMessage("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPwError("Something went wrong");
    } finally {
      setPwSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="account-page">
      <h1>Account Settings</h1>

      <section className="account-section">
        <h2>Update Name</h2>
        <form onSubmit={handleNameSubmit} className="auth-form">
          {nameError && <div className="auth-error" role="alert">{nameError}</div>}
          {nameMessage && <div className="account-success" role="status">{nameMessage}</div>}

          <label htmlFor="accountName">Display Name</label>
          <input
            id="accountName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />

          <button type="submit" className="btn-primary" disabled={nameSaving || !name.trim()}>
            {nameSaving ? "Saving..." : "Save Name"}
          </button>
        </form>
      </section>

      <section className="account-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="auth-form">
          {pwError && <div className="auth-error" role="alert">{pwError}</div>}
          {pwMessage && <div className="account-success" role="status">{pwMessage}</div>}

          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <PasswordRequirements password={newPassword} />

          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn-primary"
            disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
          >
            {pwSaving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </section>

      <section className="account-section account-section--info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </section>
    </div>
  );
}
