import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

let ObjectId = mongoose.Schema.ObjectId;

let notification = new mongoose.Schema(
  {
    senderUserId: { type: ObjectId },
    receiverUserId: { type: ObjectId },
    subjectId: { type: ObjectId },
    contentId: { type: ObjectId }, // When content is liked this field is used
    commentId: { type: ObjectId }, // When comment is liked this field is used
    type: {
      type: String,
      enum: ["LIKE", "COMMENT", "REPLY", "FOLLOW"],
    },
    rootCommentId: ObjectId, // To get all the replies of a comments
    parentCommentId: ObjectId, // to build a reply tree for a comment
    likeCount: Number,
    replyCount: Number,
    isDisabled: { default: false, type: Boolean },
    isDeleted: { default: false, type: Boolean }, // For comments
    //If a user deleted a comment, we don't want sub comments to be deleted
    data: Object,
  },
  { timestamps: true }
);

//For showing notification
notification.index({ receiverUserId: 1, createdAt: 1 });

//To check like & follow
notification.index({ senderUserId: 1, subjectId: 1, type: 1 });

//To get list of comments
notification.index({ subjectId: 1, type: 1, createdAt: -1 });

//To get list of replies
notification.index({ rootCommentId: 1, type: 1, createdAt: -1 });

export default mainMongooseInstance.model("notification", notification);
