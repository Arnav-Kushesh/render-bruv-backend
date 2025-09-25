import Notification from "../../../database/models/Notification.js";

async function getFollowStatusList(IDs, userId) {
  let users = await Notification.find({
    receiverID: { $in: IDs },
    senderID: userId,
    status: "POSITIVE",
  }).select("receiverID");

  return users;
}

export default getFollowStatusList;
