import Notification from "../../../database/models/Notification.js";
import updateFollowCounts from "../utils/updateFollowCount.js";

export default async function postFollowOrUnfollow(req, res, next) {
  try {
    // Step 1: Require login
    if (!req.user) {
      return next("Login required");
    }

    const { receiverUserId, action } = req.body;

    if (!receiverUserId) {
      return next("receiverUserId is required");
    }

    if (!action || !["FOLLOW", "UNFOLLOW"].includes(action)) {
      return next("Invalid action. Use 'follow' or 'unfollow'.");
    }
    if (receiverUserId.toString() === req.user._id.toString()) {
      return next("You cannot follow yourself");
    }

    if (action === "FOLLOW") {
      // Check if already following
      const existingFollow = await Notification.findOne({
        senderUserId: req.user._id,
        subjectId: receiverUserId,
        type: "FOLLOW",
      });

      if (existingFollow) {
        return res.json({
          success: true,
          message: "Already following",
        });
      }

      // Create new follow
      const newFollow = await Notification.create({
        senderUserId: req.user._id,
        receiverUserId,
        subjectId: receiverUserId,
        type: "FOLLOW",
      });

      await updateFollowCounts(receiverUserId);
      await updateFollowCounts(req.user._id);

      return res.json({
        success: true,
        message: "Followed successfully",
        item: newFollow,
      });
    }

    if (action === "UNFOLLOW") {
      const result = await Notification.deleteOne({
        senderUserId: req.user._id,
        subjectId: receiverUserId,
        type: "FOLLOW",
      });

      //   if (result.deletedCount === 0) {
      //     return next("You are not following this user");
      //   }

      await updateFollowCounts(receiverUserId);
      await updateFollowCounts(req.user._id);

      return res.json({
        success: true,
        message: "Unfollowed successfully",
      });
    }
  } catch (err) {
    next(err);
  }
}
