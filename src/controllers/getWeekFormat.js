import currentWeekNumber from 'current-week-number';

export default function getWeekFormat(aDate) {
  let theWeekNumber = currentWeekNumber(aDate);
  let year = aDate.getFullYear();

  if (theWeekNumber > 52) {
    year = year - 1;
  }

  return `${theWeekNumber}/${year}`;
}
