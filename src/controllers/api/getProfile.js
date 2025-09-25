import Profile from "../../database/models/Profile.js";
import getProfileMeta from "./getProfileMeta.js";

export default async function getProfile(req, res, next) {
  let query = {};
  if (req.query.username) {
    query = { username: req.query.username };
  } else {
    if (!req.user) return next("Username parameter missing");
    let id = req.user._id;
    if (req.query.userId) id = req.query.userId;
    query = { _id: id };
  }

  let user = await Profile.findOne(query);

  if (!user) return next("User not found");

  user = JSON.parse(JSON.stringify(user));

  let profileMetaData = await getProfileMeta(user._id);
  profileMetaData = JSON.parse(JSON.stringify(profileMetaData));

  return res.json({
    data: {
      user,
      profileMetaData,
    },
  });
}
