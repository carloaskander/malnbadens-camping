const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidIsoDate = (value) => {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

export const getStockholmDate = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const dateParts = Object.fromEntries(
    parts
      .filter(({ type }) => ['year', 'month', 'day'].includes(type))
      .map(({ type, value }) => [type, value]),
  );

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

export const isSeasonCurrent = (season, currentDate = getStockholmDate()) => {
  if (!isValidIsoDate(currentDate) || !Array.isArray(season?.periods)) {
    return false;
  }

  return season.periods.some((period) => {
    const { start, end } = period ?? {};

    if (!isValidIsoDate(start) || !isValidIsoDate(end) || start > end) {
      return false;
    }

    return currentDate >= start && currentDate <= end;
  });
};
