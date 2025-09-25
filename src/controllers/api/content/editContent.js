import Content from "../../../database/models/Content.js";
import addSearchableText from "../../search/addSearchableText.js";

export default async function editContent(req, res, next) {
  try {
    // Step 1: Require login
    if (!req.user) {
      return next("Login required");
    }

    const { itemId, changes } = req.body;

    let { title, description, purpose, images } = changes;
    if (!itemId) {
      return next("contentId is required");
    }

    // Find content
    const content = await Content.findById(itemId);
    if (!content) {
      return next("Content not found");
    }

    // Check ownership
    if (content.authorUserId.toString() !== req.user._id.toString()) {
      return next("Permission denied");
    }

    // Update only allowed fields if provided
    if (typeof title === "string") content.title = title;
    if (typeof description === "string") content.description = description;

    if (Array.isArray(images)) content.images = images;

    content.purpose = purpose;

    await content.save();

    await addSearchableText({
      itemId: itemId,
      itemType: "CONTENT",
      loggedInUser: req.user,
    });

    res.json({
      success: true,
      data: { message: "Content updated successfully", item: content },
    });
  } catch (err) {
    next(err);
  }
}
