import Notification from "../../../database/models/Notification.js";
import attachAuthorToDocs from "../utils/attachAuthorToDocs.js";
import attachLikeStatusToDocs from "../utils/attachLikeStatusToDocs.js";

export default async function getComments(req, res, next) {
  try {
    const { contentId } = req.query;
    if (!contentId) {
      return next("contentId is required");
    }

    let defaultLimit = 300;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    const filter = {
      subjectId: contentId,
      type: "COMMENT",
    };

    // Step 1: Get comments (no joins yet)
    let comments = await Notification.find(filter)
      .sort({ likeCount: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalComments = await Notification.countDocuments(filter);

    // Step 2: Attach authors
    comments = await attachAuthorToDocs(comments, "senderUserId");

    // Step 3: Attach likes (only if logged in)
    if (req.user) {
      comments = await attachLikeStatusToDocs(comments, req.user._id);
    }

    res.json({
      success: true,
      data: {
        page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        comments,
      },
    });
  } catch (err) {
    next(err);
  }
}
