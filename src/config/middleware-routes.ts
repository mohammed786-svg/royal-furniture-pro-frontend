/** Route groups for future auth middleware extensions */
export const middlewareRoutes = {
  protected: [
    "/admin/dashboard",
    "/admin/catalog",
    "/admin/inventory",
    "/admin/orders",
    "/admin/customers",
    "/admin/marketing",
    "/admin/payments",
    "/admin/shipping",
    "/admin/analytics",
    "/admin/notifications",
    "/admin/settings",
    "/admin/administration",
    "/account",
    "/checkout",
  ],
  public: ["/", "/login", "/register", "/admin/login"],
} as const;
