import SystemActivity from "../../database/models/SystemActivity.js";

let quota = {
  UNSPLASH_SEARCH: 100,
  IMAGE_UPLOAD: 20,
  POST_CONTENT: 10,
  POST_LIKE: 100,
  POST_COMMENT: 20,
};

export default async function wipeOldSystemActivities({
  loggedInUserId,
  type,
}) {
  let dayInMilliseconds = 24 * 60 * 60 * 1000;

  await SystemActivity.deleteMany({
    type: type,
    authorUserId: loggedInUserId,
    createdAt: { $lt: new Date(Date.now() - dayInMilliseconds) },
  });
}
