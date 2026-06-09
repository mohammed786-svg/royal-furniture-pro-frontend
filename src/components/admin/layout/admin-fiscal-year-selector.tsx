"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Check, ChevronDown } from "lucide-react";
import { useFiscalYearStore } from "@/lib/admin/fiscal-year-store";

type AdminFiscalYearSelectorProps = {
  onOpen?: () => void;
};

export function AdminFiscalYearSelector({ onOpen }: AdminFiscalYearSelectorProps) {
  const selected = useFiscalYearStore((s) => s.selected);
  const options = useFiscalYearStore((s) => s.options);
  const setFiscalYear = useFiscalYearStore((s) => s.setFiscalYear);

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="admin-fiscal-wrap hidden md:block">
      <button
        type="button"
        className={`admin-header-fiscal ${open ? "active" : ""}`}
        onClick={() => {
          if (!open) onOpen?.();
          setOpen((prev) => !prev);
        }}
        aria-label="Select financial year"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Calendar size={14} />
        <span>
          Financial Year: <strong>{selected.label}</strong>
        </span>
        <ChevronDown
          size={14}
          className={`admin-fiscal-chevron ${open ? "open" : ""}`}
        />
      </button>

      {open && (
        <div
          className="admin-fiscal-dropdown"
          role="listbox"
          aria-label="Financial years"
        >
          <div className="admin-fiscal-dropdown-head">
            <p>Select Financial Year</p>
            <span>Apr – Mar (India)</span>
          </div>
          <ul className="admin-fiscal-list">
            {options.map((year) => {
              const isSelected = year.id === selected.id;
              return (
                <li key={year.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`admin-fiscal-option ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      setFiscalYear(year);
                      setOpen(false);
                    }}
                  >
                    <span>FY {year.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
