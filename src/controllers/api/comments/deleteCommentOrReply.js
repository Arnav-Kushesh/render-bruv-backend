import mongoose from "mongoose";
import Notification from "../../../database/models/Notification.js";

const deleteCommentOrReply = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.user) {
      return next("Login required");
    }

    // Validate itemId
    const { itemId } = req.body;
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return next("Invalid item ID");
    }

    // Find the comment/reply
    const doc = await Notification.findById(itemId);
    if (!doc) {
      return next("Comment or reply not found");
    }

    //Permission check
    if (doc.authorUserId.toString() !== req.user._id.toString()) {
      return next("Permission denied");
    }

    // Soft delete by setting isDeleted = true
    doc.isDeleted = true;
    await doc.save();

    if (doc.contentId) await updateCommentCount(doc.contentId);

    // Success response
    res.json({ success: true, message: "Marked as deleted" });
  } catch (err) {
    next(err);
  }
};

export default deleteCommentOrReply;
