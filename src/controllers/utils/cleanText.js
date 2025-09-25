export default function cleanText(item) {
  if (!item) return null;
  if (typeof item !== "string") return item;
  item = item.trim();
  if (!item.length) return "";

  return item;
}
