import SystemActivity from "../../database/models/SystemActivity.js";

export default async function captureActivity({ loggedInUserId, type }) {
  let newActivity = new SystemActivity();
  newActivity.type = type;
  newActivity.authorUserId = loggedInUserId;
  await newActivity.save();
}
