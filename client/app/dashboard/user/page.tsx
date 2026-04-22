"use client";

const stats = [
  { label: "Orders", value: "12", note: "3 in progress" },
  { label: "Wishlist", value: "08", note: "2 price drops" },
  { label: "Recent Activity", value: "19", note: "This week" },
];

const activities = [
  { title: "Order placed for Calculus Notes", meta: "Today, 10:30 AM" },
  { title: "Wishlist update on Hostel Desk Lamp", meta: "Yesterday, 7:10 PM" },
  { title: "Profile verified successfully", meta: "Monday, 2:45 PM" },
];

const products = [
  { name: "Applied Physics Lab Kit", category: "Lab Essentials", price: "Rs. 1,250" },
  { name: "Data Structures Handbook", category: "Books", price: "Rs. 420" },
  { name: "Ergonomic Study Chair", category: "Furniture", price: "Rs. 3,800" },
  { name: "Campus Shuttle Pass", category: "Services", price: "Rs. 650" },
];

export default function UserDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="border border-slate-200 bg-white px-6 py-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
          Student Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Track your orders, review recent activity, and keep an eye on the items
          you want to pick up next.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-slate-200 bg-white px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {stat.label}
            </p>
            <p className="mt-4 text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {activities.map((activity) => (
              <div key={activity.title} className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-500">{activity.meta}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Order Snapshot
            </h2>
          </div>
          <div className="space-y-4 px-6 py-5 text-sm text-slate-500">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span>Awaiting confirmation</span>
              <span className="font-semibold text-slate-900">02</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span>Out for delivery</span>
              <span className="font-semibold text-slate-900">01</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completed this month</span>
              <span className="font-semibold text-slate-900">09</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
            Product Preview
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {products.map((product) => (
            <div
              key={product.name}
              className="grid gap-2 px-6 py-4 md:grid-cols-[1.3fr_0.9fr_0.6fr]"
            >
              <p className="text-sm font-semibold text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-500">{product.category}</p>
              <p className="text-sm font-semibold text-slate-900 md:text-right">
                {product.price}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
