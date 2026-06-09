"use client";

import type { ReactNode } from "react";

type ProductFormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function ProductFormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className = "",
}: ProductFormFieldProps) {
  return (
    <div className={`admin-product-field ${className} ${error ? "has-error" : ""}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && <span className="admin-required">*</span>}
      </label>
      {children}
      {hint && !error && <span className="admin-field-hint">{hint}</span>}
      {error && <span className="admin-field-error">{error}</span>}
    </div>
  );
}
