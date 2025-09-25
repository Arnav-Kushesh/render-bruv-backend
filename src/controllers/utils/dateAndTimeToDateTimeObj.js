export default function dateAndTimeToDateTimeObj({ date, hour }) {
  // Combine date and time into a single string

  // Create a Date object
  const dateObj = new Date(date);

  dateObj.setHours(hour);

  return dateObj.toISOString();
}
