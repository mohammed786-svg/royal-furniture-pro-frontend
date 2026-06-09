import {
  Bell,
  CreditCard,
  Headphones,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  Settings,
  ShoppingBag,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";

export type AccountMenuItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  external?: boolean;
};

export const ACCOUNT_MENU_MAIN: AccountMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/account",
    icon: LayoutDashboard,
    description: "Overview & quick actions",
  },
  {
    id: "profile",
    label: "My Profile",
    href: "/account/profile",
    icon: User,
    description: "Personal details",
  },
  {
    id: "orders",
    label: "My Orders",
    href: "/account/orders",
    icon: Package,
    description: "Order history",
  },
  {
    id: "track",
    label: "Track Order",
    href: "/track-order",
    icon: Truck,
    description: "Live shipment status",
    external: true,
  },
  {
    id: "addresses",
    label: "Saved Addresses",
    href: "/account/addresses",
    icon: MapPin,
    description: "Home, office & more",
  },
];

export const ACCOUNT_MENU_SHOPPING: AccountMenuItem[] = [
  {
    id: "wishlist",
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    external: true,
  },
  {
    id: "cart",
    label: "My Cart",
    href: "/cart",
    icon: ShoppingBag,
    external: true,
  },
  {
    id: "payments",
    label: "Payment History",
    href: "/account/payments",
    icon: CreditCard,
    description: "UPI & bank payments",
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    href: "/account/returns",
    icon: RotateCcw,
    description: "Return furniture items",
  },
];

export const ACCOUNT_MENU_SUPPORT: AccountMenuItem[] = [
  {
    id: "notifications",
    label: "Notifications",
    href: "/account/notifications",
    icon: Bell,
  },
  {
    id: "support",
    label: "Help & Support",
    href: "/account/support",
    icon: Headphones,
  },
  {
    id: "settings",
    label: "Account Settings",
    href: "/account/settings",
    icon: Settings,
  },
];

export const ACCOUNT_MENU_LOGOUT: AccountMenuItem = {
  id: "logout",
  label: "Logout",
  href: "#logout",
  icon: LogOut,
};

export function isAccountPath(pathname: string, href: string) {
  if (href === "/account") return pathname === "/account";
  if (href.startsWith("/account")) return pathname.startsWith(href);
  return pathname === href;
}
