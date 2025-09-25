import cleanObject from "../utils/cleanObject.js";

export default async function getLoggedInUser(req, res, next) {
  if (!req.user) return next("User not found");

  let user = cleanObject(req.user);

  return res.json({ data: user });
}
