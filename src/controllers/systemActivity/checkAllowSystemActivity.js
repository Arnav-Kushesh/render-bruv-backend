import SystemActivity from "../../database/models/SystemActivity.js";

let quota = {
  UNSPLASH_SEARCH: 100,
  IMAGE_UPLOAD: 10,
  POST_CONTENT: 50,
  POST_LIKE: 100,
  POST_COMMENT: 20,
  REQUEST_MEMBERSHIP: 5,
  ACTIVITY_RECHARGE: 5,
};

export default async function checkAllowSystemActivity({
  loggedInUserId,
  type,
}) {
  let dayInMilliseconds = 24 * 60 * 60 * 1000;

  let activities = await SystemActivity.find({
    type: type,
    authorUserId: loggedInUserId,
    createdAt: { $gt: new Date(Date.now() - dayInMilliseconds) },
  });

  if (activities.length > quota[type]) return false;
  return true;
}
