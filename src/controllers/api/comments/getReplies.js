import Notification from "../../../database/models/Notification.js";
import attachAuthorToDocs from "../utils/attachAuthorToDocs.js";
import attachLikeStatusToDocs from "../utils/attachLikeStatusToDocs.js";

export default async function getReplies(req, res, next) {
  try {
    const { rootCommentId } = req.query;
    if (!rootCommentId) {
      return next("rootCommentId is required");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;
    const skip = (page - 1) * limit;

    const filter = {
      rootCommentId,
      type: "REPLY",
    };

    // Step 1: Get replies
    let replies = await Notification.find(filter)
      .skip(skip)
      .limit(limit)
      .lean();

    console.log("replies", replies);

    const totalReplies = await Notification.countDocuments(filter);

    // Step 2: Attach authors
    replies = await attachAuthorToDocs(replies, "senderUserId");

    // Step 3: Attach likes (if logged in)
    if (req.user) {
      replies = await attachLikeStatusToDocs(replies, req.user._id);
    }

    // Step 4: Build nested reply tree
    const replyMap = {};
    replies.forEach(
      (r) => (replyMap[r._id.toString()] = { ...r, children: [] })
    );

    const tree = [];
    replies.forEach((reply) => {
      if (reply.parentCommentId && replyMap[reply.parentCommentId.toString()]) {
        //parent comment is actual a reply

        replyMap[reply.parentCommentId.toString()].children.push(
          replyMap[reply._id.toString()]
        );
      } else if (reply.parentCommentId.toString() == rootCommentId) {
        //parent comment is the rootComment
        tree.push(replyMap[reply._id.toString()]);
      }
    });

    //  data: {
    //   page,
    //   totalPages: Math.ceil(totalReplies / limit),
    //   totalReplies,
    //   replies: tree,
    // },

    res.json({
      success: true,
      data: tree,
    });
  } catch (err) {
    next(err);
  }
}
