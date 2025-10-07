import ServerInstance from "../../database/models/ServerInstance.js";
import checkModeratorAccess from "../admin/checkModeratorAccess.js";
import handlePagination from "../utils/handlePagination.js";

export default async function getServerInstanceList(req, res, next) {
  try {
    let loggedInUser = req.user;

    if (!loggedInUser) return next("Login Required");

    let match = {
      authorUserId: req.user._id,
    };

    if (req.query.completeListForAdmin) {
      let hasAccess = await checkModeratorAccess(req);
      if (!hasAccess) return next("Permission Denied");
      match = {};
    }

    if (req.query.status) match.status = req.query.status;

    await handlePagination({
      req,
      res,
      Collection: ServerInstance,
      query: match,
      sortQuery: { createdAt: -1 },
    });
  } catch (e) {
    console.log(e);
    return res.json({ error: e.message });
  }
}
