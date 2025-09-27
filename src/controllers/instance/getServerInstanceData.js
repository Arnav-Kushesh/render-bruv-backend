import ServerInstance from "../../database/models/ServerInstance.js";
import getInstanceDataFromRunpod from "./runpod/getInstanceDataFromRunpod.js";

export default async function getServerInstanceData(req, res, next) {
  try {
    let loggedInUser = req.user;
    let { itemId } = req.query;

    let serverInstance = await ServerInstance.findOne({ _id: itemId });

    if (!serverInstance) return next("Instance not found");

    if (serverInstance.authorUserId.toString() !== loggedInUser._id.toString())
      return next("Permission Denied");

    let podData = await getInstanceDataFromRunpod(serverInstance.podId);

    return res.json({ data: { podData, serverInstance } });
  } catch (e) {
    console.log(e);
    return res.json({ error: e.message });
  }
}
