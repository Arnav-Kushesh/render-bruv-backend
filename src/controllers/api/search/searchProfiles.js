import Profile from "../../../database/models/Profile.js";

export default async function searchProfiles(req, res, next) {
  let data = [];

  if (!req.query.query) return res.json({ data: data });

  let limit = 20;
  let pagination = req.query.pagination;

  data = await Profile.find({
    $text: { $search: req.query.query },
  })
    .skip(limit * pagination)
    .limit(20);

  return res.json({ data: data });
}
