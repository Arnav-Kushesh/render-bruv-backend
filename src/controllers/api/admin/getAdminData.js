import AdminData from "../../../database/models/AdminData.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";

export default async function getAdminData(req, res, next) {
  if (!req.user) return next("Login required");

  let everyoneCanReadTypes = ["MODERATOR_LIST"];

  let { type } = req.query;

  if (!everyoneCanReadTypes.includes(type)) {
    let isAllowed = await checkModeratorAccess(req);
    if (!isAllowed) return next("Permission Denied");
  }

  let existingItem = await AdminData.findOne({ type: type });

  return res.json({ data: existingItem });
}
