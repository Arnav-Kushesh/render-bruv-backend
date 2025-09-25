export default function cleanObject(item) {
  return JSON.parse(JSON.stringify(item));
}
