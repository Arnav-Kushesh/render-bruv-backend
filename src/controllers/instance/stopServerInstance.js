import ServerInstance from "../../database/models/ServerInstance.js";
import stopInstanceOnRunpod from "./runpod/stopInstanceOnRunpod.js";

export default async function stopServerInstance(req, res, next) {
  try {
    let loggedInUser = req.user;

    if (!loggedInUser) return next("Login Required");

    let { itemId } = req.body;

    let instance = await ServerInstance.findOne({ _id: itemId });

    if (!instance) return next(`Instance not found ${itemId}`);

    if (instance.authorUserId.toString() !== loggedInUser._id.toString())
      return next("Permission Denied");

    if (instance.podId) {
      await stopInstanceOnRunpod(instance.podId);
    } else {
      //pod id was never assigned
      instance.status = "TERMINATED";
      await instance.save();
    }

    return res.json({ data: true });
  } catch (e) {
    console.log(e);
    return res.json({ error: e.message });
  }
}
