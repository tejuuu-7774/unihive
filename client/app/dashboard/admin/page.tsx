"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "seller" | "admin";
  isBanned: boolean;
  isVerified?: boolean;
  verificationStatus?: string;
};

type Verification = {
  _id: string;
  name: string;
  email: string;
};

type ProductResponse = {
  _id: string;
};

type ApiResponse<T> = {
  data?: T;
};

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboardData = async () => {
      try {
        const [usersResponse, verificationsResponse, productsResponse] =
          await Promise.all([
            apiRequest("/admin/users"),
            apiRequest("/admin/verifications?status=pending"),
            apiRequest("/admin/products"),
          ]);

        if (!active) {
          return;
        }

        const fetchedUsers = Array.isArray((usersResponse as ApiResponse<User[]>).data)
          ? (usersResponse as ApiResponse<User[]>).data ?? []
          : [];
        const fetchedVerifications = Array.isArray(
          (verificationsResponse as ApiResponse<Verification[]>).data
        )
          ? (verificationsResponse as ApiResponse<Verification[]>).data ?? []
          : [];
        const fetchedProducts = Array.isArray(
          (productsResponse as ApiResponse<ProductResponse[]>).data
        )
          ? (productsResponse as ApiResponse<ProductResponse[]>).data ?? []
          : [];

        setUsers(fetchedUsers);
        setVerifications(fetchedVerifications);
        setProductCount(fetchedProducts.length);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await apiRequest(`/users/approve/${id}`, "PUT");

      setVerifications((currentVerifications) =>
        currentVerifications.filter((verification) => verification._id !== id)
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === id
            ? {
                ...user,
                role: "seller",
                isVerified: true,
                verificationStatus: "approved",
              }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to approve seller", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiRequest(`/users/reject/${id}`, "PUT");

      setVerifications((currentVerifications) =>
        currentVerifications.filter((verification) => verification._id !== id)
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === id
            ? {
                ...user,
                role: "user",
                isVerified: false,
                verificationStatus: "rejected",
              }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to reject seller", error);
    }
  };

  const handleBanToggle = async (user: User) => {
    try {
      const endpoint = user.isBanned
        ? `/admin/users/${user._id}/unban`
        : `/admin/users/${user._id}/ban`;

      await apiRequest(endpoint, "PUT");

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id
            ? {
                ...currentUser,
                isBanned: !currentUser.isBanned,
              }
            : currentUser
        )
      );
    } catch (error) {
      console.error("Failed to update user ban state", error);
    }
  };

  const handleDowngrade = async (id: string) => {
      try {
        await apiRequest(`/users/downgrade/${id}`, "PUT");

        setUsers((prev) =>
          prev.map((u) =>
            u._id === id
              ? {
                  ...u,
                  role: "user",
                  isVerified: false,
                  verificationStatus: "none",
                }
              : u
          )
        );
      } catch (err) {
        console.error("Failed to downgrade seller", err);
      }
    };

  const totalUsers = users.length;
  const totalSellers = users.filter((user) => user.role === "seller").length;
  const pendingApprovals = verifications.length;
  const platformStats = [
    { label: "Total Users", value: loading ? "..." : String(totalUsers) },
    { label: "Sellers", value: loading ? "..." : String(totalSellers) },
    {
      label: "Products",
      value: loading ? "..." : String(productCount ?? 0),
    },
    {
      label: "Pending Approvals",
      value: loading ? "..." : String(pendingApprovals),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="border border-slate-200 bg-white px-6 py-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
          Admin Control Panel
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-900">
          Platform management
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Review platform health, process seller approvals, and manage user access
          from one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {platformStats.map((stat) => (
          <div key={stat.label} className="border border-slate-200 bg-white px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {stat.label}
            </p>
            <p className="mt-4 text-3xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
            Pending Seller Approvals
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Name
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    Loading
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">Loading</td>
                  <td className="px-6 py-4 text-sm text-slate-500">Loading</td>
                </tr>
              ) : verifications.length > 0 ? (
                verifications.map((seller) => (
                  <tr key={seller._id} className="border-b border-slate-200">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {seller.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {seller.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(seller._id)}
                          className="border border-slate-900 bg-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-[#7C3AED] hover:bg-[#7C3AED]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(seller._id)}
                          className="border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 transition-colors hover:border-[#7C3AED] hover:text-[#7C3AED]"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    No pending requests
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">-</td>
                  <td className="px-6 py-4 text-sm text-slate-500">-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
            User Management
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Name
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Role
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    Loading
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">Loading</td>
                  <td className="px-6 py-4 text-sm uppercase text-slate-900">
                    Loading
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">Loading</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-200">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm uppercase text-slate-900">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 flex gap-2">

                      {/* Ban / Unban */}
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleBanToggle(user)}
                          className="border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 transition-colors hover:border-[#7C3AED] hover:text-[#7C3AED]"
                        >
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>
                      )}

                      {/* Downgrade (ONLY seller) */}
                      {user.role === "seller" && (
                        <button
                          onClick={() => handleDowngrade(user._id)}
                          className="border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 transition-colors hover:border-[#7C3AED] hover:text-[#7C3AED]"
                        >
                          Downgrade
                        </button>
                      )}

                      {/* Admin protection */}
                      {user.role === "admin" && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Protected
                        </span>
                      )}

                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    No users found
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">-</td>
                  <td className="px-6 py-4 text-sm uppercase text-slate-900">-</td>
                  <td className="px-6 py-4 text-sm text-slate-500">-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
