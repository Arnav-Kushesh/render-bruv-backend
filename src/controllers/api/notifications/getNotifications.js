import Notification from "../../../database/models/Notification.js";
import Profile from "../../../database/models/Profile.js";
import mongoose from "mongoose";

export default async function getNotifications(req, res, next) {
  try {
    if (!req.user) return next("Login Required");

    const loggedInUser = await Profile.findById(req.user._id).lean();
    const limit = 50;
    const skip = req.query.offset ? parseInt(req.query.offset) * limit : 0;

    const filter = {
      receiverUserId: new mongoose.Types.ObjectId(req.user._id),
      isDisabled: false,
      isDeleted: false,
    };

    const sortQuery = { createdAt: -1 };

    const notifs = await Notification.aggregate([
      { $match: filter },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit },

      // Attach sender profile
      {
        $lookup: {
          from: "profiles",
          localField: "senderUserId",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },

      // Attach related content
      {
        $lookup: {
          from: "contents",
          localField: "contentId",
          foreignField: "_id",
          as: "contentData",
        },
      },
      { $unwind: { path: "$contentData", preserveNullAndEmptyArrays: true } },

      // Attach related comment/reply if subject is a comment/reply
      //in case a comment got a reply or like
      {
        $lookup: {
          from: "notifications",
          localField: "commentId",
          foreignField: "_id",
          as: "commentData",
        },
      },
      { $unwind: { path: "$commentData", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          type: 1,
          createdAt: 1,
          contentId: 1,
          type: 1,
          data: 1,
          commentId: 1,
          subjectId: 1,
          // sender
          "sender._id": 1,
          "sender.username": 1,
          "sender.profileImage": 1,
          "sender.name": 1,

          // content data
          "contentData._id": 1,
          "contentData.title": 1,
          "contentData.description": 1,
          "contentData.images": 1,
          "contentData.type": 1,

          // comment data
          "commentData._id": 1,
          "commentData.data": 1,
          "commentData.type": 1,
        },
      },
    ]);

    // Mark notifications as seen
    await Profile.findByIdAndUpdate(req.user._id, {
      notificationsSeenAt: new Date(),
    });

    return res.json({
      data: {
        notifs,
        notificationsSeenAt: loggedInUser.notificationsSeenAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
