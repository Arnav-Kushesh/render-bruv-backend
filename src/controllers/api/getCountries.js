import countrycitystatejson from 'countrycitystatejson';

export default function getCountries(req, res, next) {
  let countries = countrycitystatejson.getCountries();

  let countryList = [];

  for (let country of countries) {
    let { shortName, name } = country;
    countryList.push({ label: name, value: shortName });
  }

  return res.json({ data: countryList });
}
