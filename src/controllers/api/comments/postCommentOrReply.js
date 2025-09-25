import Notification from "../../../database/models/Notification.js";
import Content from "../../../database/models/Content.js";
import updateCommentCount from "../utils/updateCommentCount.js";

export default async function postCommentOrReply(req, res, next) {
  try {
    // Step 1: Require login
    if (!req.user) {
      return next("Login required");
    }

    const { contentId, data, rootCommentId, parentCommentId } = req.body;

    let type = "COMMENT";
    if (rootCommentId) type = "REPLY";

    // Step 2: Validate required fields
    if (!type || !["COMMENT", "REPLY"].includes(type)) {
      return next("Invalid type");
    }

    if (!contentId) {
      return next("contentId is required");
    }

    let receiverUserId;

    if (type === "COMMENT") {
      // Receiver is the content's author
      const contentDoc = await Content.findById(contentId).lean();
      if (!contentDoc) return next("Content not found");
      receiverUserId = contentDoc.authorUserId;
    } else if (type === "REPLY") {
      if (!rootCommentId || !parentCommentId) {
        return next(
          "rootCommentId and parentCommentId are required for replies"
        );
      }

      // Receiver is the parent comment's author
      const parentComment = await Notification.findById(parentCommentId).lean();
      if (!parentComment) return next("Parent comment not found");
      receiverUserId = parentComment.senderUserId;
    }

    let senderUserId = req.user._id.toString();
    let isDisabled = senderUserId == receiverUserId.toString();
    //So that you don't see notification from yourself

    // Step 3: Build document payload
    const payload = {
      type,
      contentId,
      senderUserId: req.user._id,
      subjectId: contentId,
      data,
      receiverUserId,
      isDisabled,
    };

    // Step 4: Handle REPLY fields
    if (type === "REPLY") {
      payload.rootCommentId = rootCommentId;
      payload.parentCommentId = parentCommentId;
      payload.commentId = parentCommentId;

      //in case it is a reply, this field will be useful in notification
      //to show what has been commented on
    }

    // Step 5: Create the document
    const newDoc = await Notification.create(payload);

    // Step 6: Update comment count for content
    await updateCommentCount(contentId);

    if (parentCommentId) {
      await calculateReplyCountForParent(parentCommentId);
    }

    res.json({
      success: true,
      message: `${type} posted successfully`,
      data: newDoc,
    });
  } catch (err) {
    next(err);
  }
}

async function calculateReplyCountForParent(parentCommentId) {
  let count = await Notification.countDocuments({ parentCommentId });

  await Notification.findByIdAndUpdate(parentCommentId, { replyCount: count });
}
