export type FiscalYear = {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
};

/** Indian FY: April startYear → March endYear */
export function buildFiscalYear(startYear: number): FiscalYear {
  const endYear = startYear + 1;
  return {
    id: `${startYear}-${endYear}`,
    label: `${startYear} / ${endYear}`,
    startYear,
    endYear,
  };
}

export function getCurrentFiscalStartYear(date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  return month >= 3 ? year : year - 1;
}

export function getFiscalYearOptions(range = 3): FiscalYear[] {
  const current = getCurrentFiscalStartYear();
  const years: FiscalYear[] = [];
  for (let i = -range; i <= 1; i++) {
    years.push(buildFiscalYear(current + i));
  }
  return years.reverse();
}

export function getDefaultFiscalYear(): FiscalYear {
  return buildFiscalYear(getCurrentFiscalStartYear());
}
