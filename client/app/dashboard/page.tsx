export default function DashboardPage() {
  return (
    <div className="max-w-5xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">Dashboard</h1>
        {/* Change "what's" to "what&apos;s" */}
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Welcome back. Here is what&apos;s happening in your student economy today.
        </p>
      </header>
      {/* Placeholder Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Active Listings", value: "12" },
          { label: "Total Earned", value: "$420.50" },
          { label: "Account Status", value: "Verified" }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 hover:border-[#7C3AED] transition-colors">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-slate-200 bg-white p-12 text-center border-dashed">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
          Role-based content and marketplace activities will populate here
        </p>
      </div>
    </div>
  );
}