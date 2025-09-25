import Content from "../../../database/models/Content.js";
import Notification from "../../../database/models/Notification.js";

/**
 * Update the commentCount field for a content item.
 * @param {string|Object} contentId - The ID of the content.
 * @returns {Promise<void>}
 */

export default async function updateCommentCount(contentId) {
  if (!contentId) return;

  // Count only COMMENTS (not REPLIES)
  const count = await Notification.countDocuments({
    type: "COMMENT",
    contentId,
  });

  // Update Content's commentCount field
  await Content.findByIdAndUpdate(contentId, { commentCount: count });
}
