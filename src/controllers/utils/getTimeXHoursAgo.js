export default function getTimeXHoursAgo(x) {
  var d = new Date();
  let inMilliseconds = d.setHours(d.getHours() - x);
  let required = new Date(inMilliseconds);
  return required;
}
