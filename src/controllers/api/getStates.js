import countrycitystatejson from 'countrycitystatejson';

export default function getStates(req, res, next) {
  if (!req.query.country) return next('Country code missing');
  let states = countrycitystatejson.getStatesByShort(req.query.country);

  let list = [];

  for (let item of states) {
    list.push({ label: item, value: item });
  }

  return res.json({ data: list });
}
