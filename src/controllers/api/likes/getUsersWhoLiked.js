import Notification from "../../../database/models/Notification.js";
import Content from "../../../database/models/Content.js";
import Profile from "../../../database/models/Profile.js";

export default async function getUsersWhoLiked(req, res, next) {
  try {
    if (!req.user) {
      return next("Login required");
    }

    let { contentId, commentId } = req.query;

    let query = { type: "LIKE" };

    if (contentId) query.subjectId = contentId;
    if (commentId) query.subjectId = commentId;

    const likedDocs = await Notification.find(query).select("senderUserId");

    const userIds = likedDocs.map((doc) => doc.senderUserId.toString());

    const profiles = await Profile.find({
      _id: {
        $in: userIds,
      },
    });

    return res.json({ data: profiles });
  } catch (err) {
    next(err);
  }
}
