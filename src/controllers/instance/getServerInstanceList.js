import ServerInstance from "../../database/models/ServerInstance.js";

export default async function getServerInstanceList(req, res, next) {
  try {
    let loggedInUser = req.user;

    if (!loggedInUser) return next("Login Required");

    let instances = await ServerInstance.find({
      authorUserId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ data: instances });
  } catch (e) {
    console.log(e);
    return res.json({ error: e.message });
  }
}
