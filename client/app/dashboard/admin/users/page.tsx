"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "seller" | "admin";
  isBanned: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let active = true;

    const fetchUsers = async () => {
      const res = await apiRequest("/admin/users");
      if (!active) return;
      setUsers(res.data || []);
    };

    fetchUsers();

    return () => {
      active = false;
    };
  }, []);

  const toggleBan = async (user: User) => {
    const endpoint = user.isBanned
      ? `/admin/users/${user._id}/unban`
      : `/admin/users/${user._id}/ban`;

    await apiRequest(endpoint, "PUT");

    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, isBanned: !u.isBanned } : u
      )
    );
  };

  const downgradeSeller = async (id: string) => {
    await apiRequest(`/users/downgrade/${id}`, "PUT");

    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, role: "user" } : u
      )
    );
  };

  return (
    <div className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
          User Management
        </h2>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="px-6 py-3 text-[10px] uppercase text-slate-500">Name</th>
            <th className="px-6 py-3 text-[10px] uppercase text-slate-500">Email</th>
            <th className="px-6 py-3 text-[10px] uppercase text-slate-500">Role</th>
            <th className="px-6 py-3 text-[10px] uppercase text-slate-500">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-slate-200">
              <td className="px-6 py-4 text-sm font-semibold">{u.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
              <td className="px-6 py-4 uppercase text-sm">{u.role}</td>

              <td className="px-6 py-4 flex gap-2">

                {/* ❌ no admin ban */}
                {u.role !== "admin" && (
                  <button
                    onClick={() => toggleBan(u)}
                    className="border px-3 py-2 text-xs"
                  >
                    {u.isBanned ? "Unban" : "Ban"}
                  </button>
                )}

                {/* seller downgrade */}
                {u.role === "seller" && (
                  <button
                    onClick={() => downgradeSeller(u._id)}
                    className="border px-3 py-2 text-xs"
                  >
                    Downgrade
                  </button>
                )}

                {u.role === "admin" && (
                  <span className="text-xs text-slate-400">Protected</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}