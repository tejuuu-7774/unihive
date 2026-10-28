"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Report = { _id: string; reason: string; details?: string; status: string; createdAt: string; reporter?: { name?: string; email?: string }; product?: { title?: string; seller?: { name?: string } } };
export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]); const [error, setError] = useState("");
  const load = useCallback(() => apiRequest("/admin/reports?status=all").then((res) => setReports(res.data || [])).catch((err) => setError(err.message)), []);
  useEffect(() => { load(); }, [load]);
  const resolve = async (id: string, status: "resolved" | "dismissed") => { const note = window.prompt("Resolution note (optional):") || ""; try { await apiRequest(`/admin/reports/${id}`, "PUT", { status, resolutionNote: note }); load(); } catch (err) { setError(err instanceof Error ? err.message : "Update failed"); } };
  return <div className="mx-auto max-w-7xl space-y-6"><header className="border bg-white p-6"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Trust and safety</p><h1 className="mt-2 text-3xl font-black">Reports</h1></header>{error && <p className="bg-red-50 p-4 text-red-700">{error}</p>}<div className="space-y-4">{reports.map((report) => <article key={report._id} className="grid gap-4 border bg-white p-5 md:grid-cols-[1fr_auto] md:items-center"><div><div className="flex gap-3"><h2 className="font-bold">{report.product?.title || "Deleted product"}</h2><span className="text-xs font-bold uppercase text-[#7C3AED]">{report.status}</span></div><p className="mt-2 text-sm text-slate-700">{report.reason}: {report.details || "No details"}</p><p className="mt-1 text-xs text-slate-500">Reported by {report.reporter?.name || "Deleted user"} · Seller {report.product?.seller?.name || "Unknown"} · {new Date(report.createdAt).toLocaleDateString()}</p></div>{report.status === "open" && <div className="flex gap-2"><button onClick={() => resolve(report._id, "resolved")} className="bg-slate-900 px-4 py-2 text-sm font-bold text-white">Resolve</button><button onClick={() => resolve(report._id, "dismissed")} className="border px-4 py-2 text-sm font-bold">Dismiss</button></div>}</article>)}{reports.length === 0 && <p className="border bg-white p-6 text-slate-500">No reports.</p>}</div></div>;
}
