import { SalesPeriod, SalesPeriodSelection } from './types';

export const salesPeriodOptions: { label: string; value: SalesPeriod }[] = [
  { label: 'Monthly', value: 'month' },
  { label: 'Quarterly', value: 'quarter' },
  { label: 'Yearly', value: 'year' },
];

const currentDate = new Date();
const statisticsStartDate = new Date(Date.UTC(2026, 5, 1));

const currentMonthStart = new Date(
  Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1),
);

const monthDiff = (start: Date, end: Date) =>
  (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
  end.getUTCMonth() -
  start.getUTCMonth();

const formatMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

const createMonthSelections = (): SalesPeriodSelection[] => {
  const monthCount = Math.max(
    1,
    monthDiff(statisticsStartDate, currentMonthStart) + 1,
  );

  return Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(
      Date.UTC(
        statisticsStartDate.getUTCFullYear(),
        statisticsStartDate.getUTCMonth() + index,
        1,
      ),
    );
    const value = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1,
    ).padStart(2, '0')}`;

    return {
      label: formatMonthLabel(date),
      value,
    };
  }).reverse();
};

const createQuarterSelections = (): SalesPeriodSelection[] => {
  const startYear = statisticsStartDate.getUTCFullYear();
  const startQuarter = Math.floor(statisticsStartDate.getUTCMonth() / 3) + 1;
  const currentYear = currentDate.getUTCFullYear();
  const currentQuarter = Math.floor(currentDate.getUTCMonth() / 3) + 1;
  const startAbsoluteQuarter = startYear * 4 + startQuarter - 1;
  const currentAbsoluteQuarter = currentYear * 4 + currentQuarter - 1;
  const quarterCount = Math.max(
    1,
    currentAbsoluteQuarter - startAbsoluteQuarter + 1,
  );

  return Array.from({ length: quarterCount }, (_, index) => {
    const absoluteQuarter = startAbsoluteQuarter + index;
    const optionYear = Math.floor(absoluteQuarter / 4);
    const quarter = (absoluteQuarter % 4) + 1;

    return {
      label: `Q${quarter} ${optionYear}`,
      value: `${optionYear}-Q${quarter}`,
    };
  }).reverse();
};

const createYearSelections = (): SalesPeriodSelection[] => {
  const startYear = statisticsStartDate.getUTCFullYear();
  const currentYear = currentDate.getUTCFullYear();
  const yearCount = Math.max(1, currentYear - startYear + 1);

  return Array.from({ length: yearCount }, (_, index) => {
    const value = String(startYear + index);

    return {
      label: value,
      value,
    };
  }).reverse();
};

export const salesPeriodSelections: Record<
  SalesPeriod,
  SalesPeriodSelection[]
> = {
  month: createMonthSelections(),
  quarter: createQuarterSelections(),
  year: createYearSelections(),
};
