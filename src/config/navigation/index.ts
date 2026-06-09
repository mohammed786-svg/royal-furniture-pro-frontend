/**
 * Database-driven navigation will replace this config at runtime.
 * Static structure placeholder for admin menu / footer links.
 */
export const navigationConfig = {
  main: [] as const,
  footer: [] as const,
  admin: [] as const,
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};
