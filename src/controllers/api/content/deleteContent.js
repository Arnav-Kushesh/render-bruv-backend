import Content from "../../../database/models/Content.js";

export default async function deleteContent(req, res, next) {
  try {
    // Step 1: Require login
    if (!req.user) {
      return next("Login required");
    }

    const { contentId } = req.body;

    if (!contentId) {
      return next("contentId is required");
    }

    // Step 2: Find content
    const content = await Content.findById(contentId);

    if (!content) {
      return next("Content not found");
    }

    // Step 3: Check ownership
    if (content.authorUserId.toString() !== req.user._id.toString()) {
      return next("Permission denied");
    }

    // Step 4: Delete content
    await Content.findByIdAndDelete(contentId);

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
