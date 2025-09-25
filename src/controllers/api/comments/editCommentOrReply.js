import Notification from "../../../database/models/Notification.js";

export default async function editCommentOrReply(req, res, next) {
  try {
    // Step 1: Require login
    if (!req.user) {
      return next("Login required");
    }

    const { itemId, data } = req.body;
    if (!itemId || typeof data !== "string") {
      return next("Invalid request");
    }

    // Step 2: Find the document
    const doc = await Notification.findById(itemId);
    if (!doc) {
      return next("Comment or reply not found");
    }

    // Step 3: Check ownership
    if (doc.authorUserId.toString() !== req.user._id.toString()) {
      return next("Permission denied");
    }

    // Step 4: Update `data` field
    doc.data = data;
    await doc.save();

    res.json({
      success: true,
      data: { message: "Updated successfully", item: doc },
    });
  } catch (err) {
    next(err);
  }
}
