import Notification from "../../../database/models/Notification.js";
import Content from "../../../database/models/Content.js";

export default async function postLike(req, res, next) {
  try {
    if (!req.user) {
      return next("Login required");
    }

    let { contentId, commentId, action } = req.body;

    if (!action) return next("Action is required");

    action = action.toUpperCase(); // Normalize case

    if (!["LIKE", "UNLIKE"].includes(action)) {
      return next("Invalid action. Must be 'LIKE' or 'UNLIKE'.");
    }

    let subjectId, receiverUserId;

    if (contentId) {
      subjectId = contentId;

      const contentDoc = await Content.findById(contentId).lean();
      if (!contentDoc) return next("Content not found");
      receiverUserId = contentDoc.authorUserId;
    } else if (commentId) {
      subjectId = commentId;

      const commentDoc = await Notification.findById(commentId).lean();

      if (!commentDoc) return next("Comment/Reply not found");
      receiverUserId = commentDoc.senderUserId;
      contentId = commentDoc.contentId;

      if (!receiverUserId) return next("comment author not found");
    } else {
      return next("Either contentId or commentId is required.");
    }

    if (action === "LIKE") {
      // Prevent duplicate likes
      const existingLike = await Notification.findOne({
        senderUserId: req.user._id,
        subjectId,
        type: "LIKE",
      });

      if (existingLike) {
        return res.json({ success: true, message: "Already liked" });
      }

      let senderUserId = req.user._id.toString();
      let isDisabled = senderUserId == receiverUserId.toString();
      //So that you don't see notification from yourself

      // Create LIKE notification
      await Notification.create({
        senderUserId: req.user._id,
        receiverUserId,
        subjectId,
        contentId: contentId || null,
        commentId: commentId || null,
        isDisabled,
        type: "LIKE",
      });
    } else if (action === "UNLIKE") {
      await Notification.deleteOne({
        senderUserId: req.user._id,
        subjectId,
        type: "LIKE",
      });
    }

    // Update like count
    if (commentId) {
      const likeCount = await Notification.countDocuments({
        subjectId: commentId,
        type: "LIKE",
      });

      await Notification.findByIdAndUpdate(commentId, { likeCount });
    } else if (contentId) {
      const likeCount = await Notification.countDocuments({
        subjectId: contentId,
        type: "LIKE",
      });

      await Content.findByIdAndUpdate(contentId, { likeCount });
    }

    res.json({
      success: true,
      message: `Successfully ${action.toLowerCase()}d`,
    });
  } catch (err) {
    next(err);
  }
}
