import SystemActivity from "../../database/models/SystemActivity.js";

let quota = {
  UPLOAD: 100,
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
