"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Verification = {
  _id: string;
  name: string;
  email: string;
};

export default function AdminVerificationsPage() {
  const [data, setData] = useState<Verification[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await apiRequest("/admin/verifications?status=pending");
      setData(res.data || []);
    };

    fetch();
  }, []);

  const approve = async (id: string) => {
    await apiRequest(`/users/approve/${id}`, "PUT");

    setData((prev) => prev.filter((v) => v._id !== id));
  };

  const reject = async (id: string) => {
    await apiRequest(`/users/reject/${id}`, "PUT");

    setData((prev) => prev.filter((v) => v._id !== id));
  };

  return (
    <div className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-sm font-bold uppercase text-slate-900">
          Seller Approvals
        </h2>
      </div>

      <table className="min-w-full">
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-6 py-6 text-sm text-slate-500">
                No pending seller requests
              </td>
            </tr>
          ) : (
            data.map((v) => (
              <tr key={v._id} className="border-b border-slate-200">
                <td className="px-6 py-4">{v.name}</td>
                <td className="px-6 py-4">{v.email}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => approve(v._id)}>Approve</button>
                  <button onClick={() => reject(v._id)}>Reject</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}