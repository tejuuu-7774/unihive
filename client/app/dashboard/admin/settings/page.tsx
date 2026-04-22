"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="border border-slate-200 bg-white px-6 py-10 space-y-6">

      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
        Admin Settings
      </h2>

      {/* Danger Zone */}
      <div className="border border-slate-200 p-6">
        <p className="text-sm font-semibold text-slate-900">
          Danger Zone
        </p>

        <p className="text-sm text-slate-500 mt-2">
          Critical actions like deleting users or resetting platform data will appear here.
        </p>

        <button
          onClick={() => setConfirm(true)}
          className="mt-4 border px-4 py-2 text-xs"
        >
          Enable Admin Controls
        </button>

        {confirm && (
          <p className="mt-3 text-xs text-[#7C3AED]">
            Admin controls enabled (UI placeholder for now)
          </p>
        )}
      </div>
    </div>
  );
}