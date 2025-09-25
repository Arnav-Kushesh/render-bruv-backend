import countrycitystatejson from "countrycitystatejson";

export default function getCities(req, res, next) {
  if (!req.query.country) return next("Country code missing");
  let items = countrycitystatejson.getCities(
    req.query.country,
    req.query.state
  );

  let list = [];

  for (let item of items) {
    list.push({ label: item, value: item });
  }

  return res.json({ data: list });
}
