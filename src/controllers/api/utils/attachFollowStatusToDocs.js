import Notification from "../../../database/models/Notification.js";

/**
 * Attaches isLiked flag for logged-in user to docs
 * @param {Array} docs - Array of doc objects
 * @param {String} userId - Logged-in user ID
 * @returns {Promise<Array>} docs with `isLiked` field
 */

export default async function attachFollowStatusToDocs(docs, userId) {
  if (!docs.length || !userId) return docs;

  docs = JSON.parse(JSON.stringify(docs));

  const followDocs = await Notification.find({
    type: "FOLLOW",
    senderUserId: userId,
    subjectId: { $in: docs.map((c) => c._id) },
  }).select("subjectId");

  const followIDs = new Set(followDocs.map((doc) => doc.subjectId.toString()));

  return docs.map((doc) => ({
    ...doc,
    followStatus: followIDs.has(doc._id.toString()),
  }));
}
