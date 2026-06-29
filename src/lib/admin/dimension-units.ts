export type DimensionUnit = "cm" | "inch" | "feet" | "meter";

export const DIMENSION_UNIT_OPTIONS: { value: DimensionUnit; label: string }[] = [
  { value: "cm", label: "Centimeters (cm)" },
  { value: "inch", label: "Inches (in)" },
  { value: "feet", label: "Feet (ft)" },
  { value: "meter", label: "Meters (m)" },
];

const TO_CM: Record<DimensionUnit, number> = {
  cm: 1,
  inch: 2.54,
  feet: 30.48,
  meter: 100,
};

export function toCm(value: number, unit: DimensionUnit): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * TO_CM[unit] * 100) / 100;
}

export function fromCm(value: number, unit: DimensionUnit): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round((value / TO_CM[unit]) * 100) / 100;
}
