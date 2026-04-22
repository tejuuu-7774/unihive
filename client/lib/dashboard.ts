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
    { label: "Browse", href: "/dashboard/user?view=browse" },
    { label: "Orders", href: "/dashboard/user?view=orders" },
    { label: "Profile", href: "/dashboard/user?view=profile" },
  ],
  seller: [
    { label: "Dashboard", href: "/dashboard/seller" },
    { label: "My Products", href: "/dashboard/seller?view=products" },
    { label: "Add Product", href: "/dashboard/seller?view=add-product" },
    { label: "Orders", href: "/dashboard/seller?view=orders" },
    { label: "Earnings", href: "/dashboard/seller?view=earnings" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin?view=users" },
    { label: "Sellers Approval", href: "/dashboard/admin?view=sellers-approval" },
    { label: "Reports", href: "/dashboard/admin?view=reports" },
    { label: "Settings", href: "/dashboard/admin?view=settings" },
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
  if (pathname === "/dashboard") {
    return true;
  }

  return pathname.startsWith(getDashboardHome(role));
}
