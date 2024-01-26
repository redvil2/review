import { LineChartItem } from '@app/shared/ui/components';
import i18n from 'i18next';

const ONE_DAY_MS = 86400000;
export const LineChartFilters = {
  FILTER_DAY: 0,
  FILTER_WEEK: 1,
  FILTER_MONTH: 2,
  FILTER_HALF_YEAR: 3,
  FILTER_MAX: 4,
};

/**
 * @description Generates a string representing a date range between two dates in the shape: startDate - endDate.
 *
 * @param {Date} startDate - The start date of the period.
 * @param {Date} endDate - The end date of the period.
 * @returns {string} A string representing the formatted date range, e.g., "January 1, 2022 - February 1, 2022".
 *
 * @function getPeriod
 */
export function getPeriod(startDate: Date, endDate: Date): string {
  const monthNames = [
    i18n.t('date.monthNameJanuary'),
    i18n.t('date.monthNameFebruary'),
    i18n.t('date.monthNameMarch'),
    i18n.t('date.monthNameApril'),
    i18n.t('date.monthNameMay'),
    i18n.t('date.monthNameJune'),
    i18n.t('date.monthNameJuly'),
    i18n.t('date.monthNameAugust'),
    i18n.t('date.monthNameSeptember'),
    i18n.t('date.monthNameOctober'),
    i18n.t('date.monthNameNovember'),
    i18n.t('date.monthNameDecember'),
  ];

  const formatDate = (date: Date) => {
    return i18n.t('analytics.dateFormat', {
      month_name: monthNames[date.getMonth()],
      day: date.getDate().toString(),
      year: date.getFullYear().toString(),
    });
  };

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * @description Generates an array of labels for a line chart based on the specified time filter.
 *
 * @param {number} filter - A numeric identifier for the time filter (day, week, month, half-year).
 * @returns {string[]} An array of labels formatted according to the specified time filter.
 *
 * @function getLabels
 */
export function getLabels(filter: number): string[] {
  let labels: string[] = [];
  if (filter === LineChartFilters.FILTER_DAY) {
    labels = ['0', '4', '8', '12', '16', '20', '24'];
  } else if (filter === LineChartFilters.FILTER_WEEK) {
    labels = [
      i18n.t('date.dayInitialMonday'),
      i18n.t('date.dayInitialTuesday'),
      i18n.t('date.dayInitialWednesday'),
      i18n.t('date.dayInitialThursday'),
      i18n.t('date.dayInitialFriday'),
      i18n.t('date.dayInitialSaturday'),
      i18n.t('date.dayInitialSunday'),
    ];

    labels = [
      ...labels.slice(new Date().getDay()),
      ...labels.slice(0, new Date().getDay()),
    ];
  } else if (filter === LineChartFilters.FILTER_MONTH) {
    const currentDate = new Date();
    const totalDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const nums = [1, 5, 10, 15, 25, totalDays];

    labels = [];
    nums.forEach(n => {
      labels.push(((n + currentDate.getDate()) % totalDays) + '');
    });
  } else if (filter === LineChartFilters.FILTER_HALF_YEAR) {
    labels = [
      i18n.t('date.monthInitialJanuary'),
      i18n.t('date.monthInitialFebruary'),
      i18n.t('date.monthInitialMarch'),
      i18n.t('date.monthInitialApril'),
      i18n.t('date.monthInitialMay'),
      i18n.t('date.monthInitialJune'),
      i18n.t('date.monthInitialJuly'),
      i18n.t('date.monthInitialAugust'),
      i18n.t('date.monthInitialSeptember'),
      i18n.t('date.monthInitialOctober'),
      i18n.t('date.monthInitialNovember'),
      i18n.t('date.monthInitialDecember'),
    ];

    labels = [
      ...labels.slice(0, new Date().getMonth()),
      ...labels.slice(new Date().getMonth()),
    ].slice(6, 12);
  }
  return labels;
}

/**
 * @description Filters and processes a collection of items for display in a line chart based on a specified time filter. Each item is assumed to have a 'key' property representing a date and a 'count' property.
 * The function converts these items into an array of objects with 'timestamp' and 'count' properties, sorted by timestamp.
 *
 * @param {number} filter - A numeric identifier for the time filter (day, week, month, half-year, max).
 * @param {Array<object>} items - An array of objects, each with a 'key' (date) and 'count' property.
 * @returns {LineChartItem[]} An array of objects formatted for use in a line chart, each with 'timestamp' and 'count'.
 *
 * @function filterItems
 */
export function filterItems(
  filter: number,
  items: Array<object>,
): LineChartItem[] {
  const currentDate = new Date();
  const dateEnd =
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
    ).getTime() + ONE_DAY_MS;
  let dateStart = dateEnd - ONE_DAY_MS;

  if (filter === LineChartFilters.FILTER_WEEK) {
    dateStart = dateEnd - ONE_DAY_MS * 7;
  } else if (filter === LineChartFilters.FILTER_MONTH) {
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() - 1; // Subtract 1 for the previous month

    if (month < 0) {
      // If month is negative, it means it's in the previous year
      month = 11; // Set month to December
      year--; // Decrease the year
    }

    dateStart = new Date(year, month, currentDate.getDate(), 0, 0, 0).getTime();
  } else if (filter === LineChartFilters.FILTER_HALF_YEAR) {
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() - 6; // Subtract 6 for half a year

    if (month < 0) {
      // If month is negative, it means it's in the previous year
      month += 12; // Adjust the month to the correct one in the previous year
      year--; // Decrease the year
    }

    dateStart = new Date(year, month, currentDate.getDate(), 0, 0, 0).getTime();
  } else if (filter === LineChartFilters.FILTER_MAX) {
    dateStart = 0;
  }

  return items
    .filter(item => {
      const time = new Date(item['key']).getTime();
      return time >= dateStart && time <= dateEnd;
    })
    .map(item => ({
      timestamp: new Date(item['key']).getTime(),
      count: item['count'],
    }))
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
}

/**
 * Normalizes data by aggregating data points into specified time intervals and filling gaps with zero-count entries.
 *
 * @description This function takes an array of data points and a period number (representing day, week, month,
 * half-year, or maximum range) and aggregates the data into these time intervals. For each interval, it calculates
 * the total count of events. It ensures that all intervals within the selected period are represented,
 * adding zero-count entries for intervals without data. The final result is an array of objects, each with a 'timestamp'
 * (representing the start of the interval) and 'count' (the aggregated count for that interval).
 *
 * @param {Array<object>} data - The array of data points, each with 'timestamp' and 'count' properties.
 * @param {number} periodNumber - The numeric identifier for the selected period (0 for day, 1 for week, etc.).
 * @returns {Array<{timestamp: number, count: number}>} An array of aggregated data points by the specified intervals.
 *
 * @function aggregateAndFillData
 */
export const aggregateAndFillData = (data, periodNumber) => {
  const now = new Date();
  const intervals: number[] = [];
  const results: { timestamp: number; count: number }[] = [];
  let intervalCount: number;

  switch (periodNumber) {
    case 0: // DAY
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      intervalCount = 24; // Cover the entire day
      for (let i = 0; i < intervalCount; i++) {
        intervals.push(
          new Date(
            startOfDay.getFullYear(),
            startOfDay.getMonth(),
            startOfDay.getDate(),
            i,
          ).getTime(),
        );
      }
      break;
    case 1: // WEEK
      intervalCount = 7;
      for (let i = 0; i < intervalCount; i++) {
        intervals.push(
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i,
          ).getTime(),
        );
      }
      break;
    case 2: // MONTH
      intervalCount = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).getDate();
      for (let i = 0; i < intervalCount; i++) {
        intervals.push(
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i,
          ).getTime(),
        );
      }
      break;
    case 3: // HALF_YEAR
      intervalCount = 6;
      for (let i = 0; i < intervalCount; i++) {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() - i + 1,
          0,
          23,
          59,
          59,
        );

        const endTimestamp = i === 0 ? now.getTime() : endOfMonth.getTime();
        const aggregatedCount = data
          .filter(
            d =>
              d.timestamp >= startOfMonth.getTime() &&
              d.timestamp <= endTimestamp,
          )
          .reduce((acc, d) => acc + d.count, 0);
        results.unshift({ timestamp: endTimestamp, count: aggregatedCount });
      }
      break;
    case 4: // MAX
      return data;
    default:
      throw new Error('Invalid period number');
  }

  intervals.reverse().forEach((start, index) => {
    const end = intervals[index + 1] || now.getTime();
    const aggregatedCount = data
      .filter(d => d.timestamp >= start && d.timestamp < end)
      .reduce((acc, d) => acc + d.count, 0);
    results.push({ timestamp: start, count: aggregatedCount });
  });

  return results;
};

/**
 *
 *
 * @description Calculates the percentage change between an old and a new value.
 *
 * @param {number} [oldValue=0] - The old or initial value.
 * @param {number} [newValue=0] - The new or current value.
 * @returns {number} The calculated percentage change, rounded to the nearest whole number.
 *
 * @function calculatePercentageChange
 */
export const calculatePercentageChange = (oldValue = 0, newValue = 0) => {
  if (oldValue === 0) {
    return newValue > 0 ? 100 : 0; // 100% increase if there's new activity, 0% otherwise
  }
  const change = newValue - oldValue;
  return Math.round((change / oldValue) * 100);
};
