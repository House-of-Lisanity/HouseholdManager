"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  disabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

type ModalType = "reset-password" | "delete" | null;

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  // Fetch users
  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
  }, [user]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(type: ModalType, userId: string) {
    setTargetUserId(userId);
    setModalType(type);
    setNewPassword("");
    setMessage("");
    setError("");
  }

  function closeModal() {
    setModalType(null);
    setTargetUserId(null);
    setMessage("");
    setError("");
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!targetUserId) return;
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/admin/users/${targetUserId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to reset password"); return; }

      setMessage("Password reset successfully");
      setNewPassword("");
      setTimeout(closeModal, 2000);
    } catch {
      setError("Something went wrong");
    }
  }

  async function handleToggleRole(u: UserInfo) {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)));
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  }

  async function handleToggleDisabled(u: UserInfo) {
    const newDisabled = !u.disabled;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: newDisabled }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((x) => (x.id === u.id ? { ...x, disabled: newDisabled } : x))
        );
      }
    } catch (err) {
      console.error("Failed to toggle account:", err);
    }
  }

  async function handleDeleteUser(e: FormEvent) {
    e.preventDefault();
    if (!targetUserId) return;
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${targetUserId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to delete user"); return; }

      setUsers((prev) => prev.filter((x) => x.id !== targetUserId));
      closeModal();
    } catch {
      setError("Something went wrong");
    }
  }

  const targetUser = users.find((u) => u.id === targetUserId);
  const isSelf = (id: string) => id === user?.id;

  if (user?.role !== "admin") return null;

  if (loading) {
    return (
      <div className="admin-users">
        <h1>User Management</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <h1>User Management</h1>

      <div className="user-list">
        {users.map((u) => (
          <div key={u.id} className={`user-row${u.disabled ? " user-row--disabled" : ""}`}>
            <div className="user-info">
              <span className="user-name">
                {u.name}
                {isSelf(u.id) && <span className="user-you"> (you)</span>}
              </span>
              <span className="user-email">{u.email}</span>
              <span className="user-meta">
                {u.disabled && <span className="status-disabled">Disabled</span>}
                {u.lastLoginAt
                  ? `Last login: ${new Date(u.lastLoginAt).toLocaleDateString()}`
                  : "Never logged in"}
                {" · "}
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </div>

            <span className={`role-badge ${u.role}`}>{u.role}</span>

            {!isSelf(u.id) && (
              <div className="user-actions">
                <button className="btn-sm" onClick={() => handleToggleRole(u)}>
                  {u.role === "admin" ? "Demote" : "Promote"}
                </button>
                <button className="btn-sm" onClick={() => handleToggleDisabled(u)}>
                  {u.disabled ? "Enable" : "Disable"}
                </button>
                <button className="btn-sm" onClick={() => openModal("reset-password", u.id)}>
                  Reset PW
                </button>
                <button
                  className="btn-sm btn-sm--danger"
                  onClick={() => openModal("delete", u.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reset Password Modal */}
      {modalType === "reset-password" && targetUser && (
        <div className="admin-modal-overlay">
          <div className="auth-card">
            <h2>Reset Password</h2>
            <p className="auth-subtitle">For: {targetUser.email}</p>

            <form onSubmit={handleResetPassword} className="auth-form">
              {error && <div className="auth-error" role="alert">{error}</div>}
              {message && <div className="account-success" role="status">{message}</div>}

              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                autoFocus
              />

              <button type="submit" className="btn-primary">Reset Password</button>
              <button type="button" className="btn-sm" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === "delete" && targetUser && (
        <div className="admin-modal-overlay">
          <div className="auth-card">
            <h2>Delete User</h2>
            <p className="auth-subtitle">
              Permanently delete <strong>{targetUser.name}</strong> ({targetUser.email}) and all their data?
            </p>
            <p className="auth-subtitle">This cannot be undone.</p>

            <form onSubmit={handleDeleteUser} className="auth-form">
              {error && <div className="auth-error" role="alert">{error}</div>}

              <button type="submit" className="btn-primary btn-primary--danger">
                Yes, Delete User
              </button>
              <button type="button" className="btn-sm" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
