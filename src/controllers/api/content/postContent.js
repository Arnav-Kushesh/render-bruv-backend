import Content from "../../../database/models/Content.js";
import addSearchableText from "../../search/addSearchableText.js";

export default async function postContent(req, res, next) {
  try {
    // Step 1: Require login
    if (!req.user) {
      return next("Login required");
    }

    const { title, description, purpose, images } = req.body;

    // Step 2: Validate required fields
    if (!title) {
      return next("Title");
    }

    if (!description) {
      return next("Description is required");
    }

    // Step 3: Build content document
    const payload = {
      title,
      purpose,
      description,
      images: Array.isArray(images) ? images : [],
      authorUserId: req.user._id,
      commentCount: 0,
    };

    // Step 4: Create and save
    const newContent = await Content.create(payload);

    await addSearchableText({
      itemId: newContent._id,
      itemType: "CONTENT",
      loggedInUser: req.user,
    });

    res.json({
      success: true,
      data: {
        message: "Content posted successfully",
        item: newContent,
      },
    });
  } catch (err) {
    next(err);
  }
}
