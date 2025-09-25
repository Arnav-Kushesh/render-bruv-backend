import Notification from "../../../database/models/Notification.js";
import Profile from "../../../database/models/Profile.js";
import mongoose from "mongoose";

export default async function getNotificationCount(req, res, next) {
  if (!req.user) return next("Login Required");

  let loggedInUser = req.user;

  let filter1 = {
    isDeleted: false,
    isDisabled: false,
    receiverUserId: new mongoose.Types.ObjectId(req.user._id),
  };

  let generalNotificationCount = 0;

  if (loggedInUser.notificationsSeenAt)
    filter1.createdAt = {
      $gte: loggedInUser.notificationsSeenAt,
    };

  generalNotificationCount = await Notification.countDocuments({ ...filter1 });

  return res.json({
    data: generalNotificationCount,
  });
}
