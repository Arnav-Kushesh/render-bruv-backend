import Profile from "../../../database/models/Profile.js";

export default async function getUser(req, res, next) {
  let username = req.query.username;

  let userData = await Profile.findOne({ username });

  if (!userData) return next("User not found.");

  if (!userData) return next("User not found");

  return res.json({ data: { userData } });
}
