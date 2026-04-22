"use client";

const sellerStats = [
  { label: "Revenue Summary", value: "Rs. 48,600", note: "+12% vs last month" },
  { label: "Total Products", value: "24", note: "18 active listings" },
  { label: "Orders Received", value: "63", note: "11 pending dispatch" },
];

const products = [
  { name: "Mechanical Drawing Kit", price: "Rs. 780", status: "Active" },
  { name: "Campus Hoodie - Navy", price: "Rs. 1,150", status: "Low stock" },
  { name: "Scientific Calculator", price: "Rs. 950", status: "Active" },
  { name: "Exam Prep Notes Bundle", price: "Rs. 320", status: "Draft" },
];

export default function SellerDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col gap-4 border border-slate-200 bg-white px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
            Seller Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-900">
            Operations overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Monitor sales, inventory movement, and incoming orders from one clean
            control surface.
          </p>
        </div>
        <button className="border border-slate-900 bg-slate-900 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#7C3AED] hover:border-[#7C3AED]">
          Add Product
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {sellerStats.map((stat) => (
          <div key={stat.label} className="border border-slate-200 bg-white px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {stat.label}
            </p>
            <p className="mt-4 text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Product Performance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track listing status and pricing at a glance.
            </p>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Updated today
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Product Name
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Price
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name} className="border-b border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {product.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
