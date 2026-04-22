export type DashboardRole = "user" | "seller" | "admin";

export type DashboardUser = {
  name?: string;
  email?: string;
  role?: string;
};

export const dashboardNavigation: Record<
  DashboardRole,
  Array<{ label: string; href: string }>
> = {
  user: [
    { label: "Dashboard", href: "/dashboard/user" },
    { label: "Browse", href: "/dashboard/user/browse" },
    { label: "Orders", href: "/dashboard/user/orders" },
    { label: "Profile", href: "/dashboard/user/profile" },
  ],

  seller: [
    { label: "Dashboard", href: "/dashboard/seller" },
    { label: "Products", href: "/dashboard/seller/products" },
    { label: "Add Product", href: "/dashboard/seller/add-product" },
    { label: "Orders", href: "/dashboard/seller/orders" },
    { label: "Earnings", href: "/dashboard/seller/earnings" },
  ],

  admin: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Sellers", href: "/dashboard/admin/verifications" },
    { label: "Products", href: "/dashboard/admin/products" },
    { label: "Reports", href: "/dashboard/admin/reports" },
    { label: "Settings", href: "/dashboard/admin/settings" },
  ],
};

export function normalizeRole(role?: string | null): DashboardRole | null {
  if (role === "user" || role === "seller" || role === "admin") {
    return role;
  }
  return null;
}

export function getDashboardHome(role: DashboardRole) {
  return `/dashboard/${role}`;
}

export function isDashboardPathAllowed(pathname: string, role: DashboardRole) {
  if (pathname === "/dashboard") return true;
  return pathname.startsWith(`/dashboard/${role}`);
}