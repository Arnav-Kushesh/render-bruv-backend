import Profile from "../../../database/models/Profile.js";
import attachFollowStatusToDocs from "../utils/attachFollowStatusToDocs.js";

export default async function getProfileDoc(req, res, next) {
  try {
    const { username, itemId } = req.query;

    let filter = {};

    if (username) filter.username = username;
    if (itemId) filter._id = itemId;

    const profileDoc = await Profile.findOne(filter).lean();
    if (!profileDoc) return next("Profile not found");

    let docs = [profileDoc];

    if (req.user) {
      docs = await attachFollowStatusToDocs(docs, req.user._id);
    }

    return res.json({
      data: docs[0],
    });
  } catch (err) {
    next(err);
  }
}
