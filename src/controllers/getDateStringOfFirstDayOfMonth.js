export default function getDateStringOfFirstDayOfMonth(dateObj) {
  return `${dateObj.getMonth() + 1}/1/${dateObj.getFullYear()}`;
}
