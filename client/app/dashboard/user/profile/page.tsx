"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { displayIndianPhone } from "@/lib/phone";

type Profile = {
  name: string; email: string; phone: string; whatsappNumber?: string; bio?: string;
  role: string; collegeName?: string;
  verificationStatus: "not_submitted" | "pending" | "approved" | "rejected";
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [studentId, setStudentId] = useState<File | null>(null);

  useEffect(() => { apiRequest("/users/me").then((res) => {
    setProfile({
      ...res.data,
      phone: displayIndianPhone(res.data.phone),
      whatsappNumber: displayIndianPhone(res.data.whatsappNumber),
    });
    setCollegeName(res.data.collegeName || "");
  }).catch((err) => setError(err.message)); }, []);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault(); if (!profile) return;
    try {
      setError("");
      const res = await apiRequest("/users/me", "PUT", { name: profile.name, phone: profile.phone, whatsappNumber: profile.whatsappNumber || "", bio: profile.bio || "" });
      setProfile({
        ...profile,
        ...res.data,
        phone: displayIndianPhone(res.data.phone),
        whatsappNumber: displayIndianPhone(res.data.whatsappNumber),
      });
      setMessage("Profile saved");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save profile"); }
  };

  const submitVerification = async (event: FormEvent) => {
    event.preventDefault(); if (!studentId) return setError("Choose a student ID image");
    const form = new FormData(); form.append("collegeName", collegeName); form.append("studentIdCard", studentId);
    try {
      const res = await apiRequest("/users/verify", "PUT", form);
      setProfile((current) => current ? { ...current, collegeName, verificationStatus: res.data.verificationStatus } : current);
      setMessage("Verification request submitted"); setError("");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not submit verification"); }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete and anonymize your account? This cannot be undone.")) return;
    try { await apiRequest("/users/me", "DELETE"); router.replace("/"); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not delete account"); }
  };

  if (!profile) return <p className="text-slate-500">Loading profile…</p>;
  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <form onSubmit={saveProfile} className="space-y-5 border border-slate-200 bg-white p-6">
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Account</p><h1 className="mt-2 text-3xl font-black">Your profile</h1></div>
        <label className="block text-sm font-semibold">Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-2 w-full border p-3" required /></label>
        <label className="block text-sm font-semibold">Email<input value={profile.email} className="mt-2 w-full border bg-slate-50 p-3" disabled /></label>
        <label className="block text-sm font-semibold">Mobile number<input type="tel" inputMode="tel" maxLength={18} placeholder="9876543210" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-2 w-full border p-3" required /><span className="mt-1 block text-xs font-normal text-slate-500">Use your 10-digit Indian mobile number. +91 is optional.</span></label>
        <label className="block text-sm font-semibold">WhatsApp number <span className="font-normal text-slate-500">(optional)</span><input type="tel" inputMode="tel" maxLength={18} placeholder="Same as mobile if left blank" value={profile.whatsappNumber || ""} onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })} className="mt-2 w-full border p-3" /></label>
        <label className="block text-sm font-semibold">Bio<textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="mt-2 min-h-28 w-full border p-3" maxLength={500} /></label>
        <div className="flex flex-wrap gap-3"><button className="bg-slate-900 px-5 py-3 text-sm font-bold text-white">Save profile</button><button type="button" onClick={deleteAccount} className="border border-red-300 px-5 py-3 text-sm font-bold text-red-700">Delete account</button></div>
      </form>
      <form onSubmit={submitVerification} className="space-y-5 border border-slate-200 bg-white p-6 self-start">
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Seller access</p><h2 className="mt-2 text-2xl font-black">Student verification</h2></div>
        <p className="text-base text-slate-600">Status: <strong className="uppercase">{profile.verificationStatus.replace("_", " ")}</strong></p>
        {profile.verificationStatus !== "approved" && profile.verificationStatus !== "pending" && <>
          <label className="block text-sm font-semibold">College name<input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} className="mt-2 w-full border p-3" required /></label>
          <label className="block text-sm font-semibold">Student ID image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setStudentId(e.target.files?.[0] || null)} className="mt-2 w-full border p-3" required /></label>
          <p className="text-sm text-slate-500">JPG, PNG, or WEBP up to 5 MB. Only administrators can access it.</p>
          <button className="bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white">Submit for review</button>
        </>}
        {profile.verificationStatus === "pending" && <p className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Your request is awaiting admin review.</p>}
        {profile.verificationStatus === "approved" && <p className="border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">You are a verified seller.</p>}
        {message && <p className="text-sm font-semibold text-emerald-700">{message}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </form>
    </div>
  );
}
