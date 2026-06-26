/** Route groups for future auth middleware extensions */
export const middlewareRoutes = {
  protected: [
    "/my-admin/dashboard",
    "/my-admin/catalog",
    "/my-admin/inventory",
    "/my-admin/orders",
    "/my-admin/customers",
    "/my-admin/marketing",
    "/my-admin/payments",
    "/my-admin/shipping",
    "/my-admin/analytics",
    "/my-admin/notifications",
    "/my-admin/settings",
    "/my-admin/administration",
    "/account",
    "/checkout",
  ],
  public: ["/", "/login", "/register", "/my-admin/login"],
} as const;
