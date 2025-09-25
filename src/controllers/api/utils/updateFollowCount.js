import Notification from "../../../database/models/Notification.js";
import Profile from "../../../database/models/Profile.js";

/**
 * Updates followerCount and followingCount for a user profile.
 * @param {string|Object} userId - The ID of the user to update.
 * @returns {Promise<void>}
 */
export default async function updateFollowCounts(userId) {
  if (!userId) return;

  // Count followers (people following this user)
  const followerCount = await Notification.countDocuments({
    receiverUserId: userId,
    type: "FOLLOW",
  });

  // Count following (people this user is following)
  const followingCount = await Notification.countDocuments({
    senderUserId: userId,
    type: "FOLLOW",
  });

  // Update profile with both counts
  await Profile.findOneAndUpdate(
    { _id: userId },
    { followerCount, followingCount },
    { new: true }
  );
}
