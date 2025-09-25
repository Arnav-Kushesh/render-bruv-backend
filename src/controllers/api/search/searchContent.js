import Content from "../../../database/models/Content.js";

export default async function searchContent(req, res, next) {
  let data = [];

  if (!req.query.query) return res.json({ data: data });

  let limit = 20;
  let pagination = req.query.pagination;

  data = await Content.find({
    $text: { $search: req.query.query },
  })
    .skip(limit * pagination)
    .limit(20);

  return res.json({ data: data });
}
