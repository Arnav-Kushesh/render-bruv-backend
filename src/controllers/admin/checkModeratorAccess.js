import adminAccess from "../../data/adminAccess.js";
import AdminData from "../../database/models/AdminData.js";

export default async function checkModeratorAccess(req) {
  if (!req.user) return false;
  if (adminAccess.includes(req.user.username)) return true;

  let moderatorListDoc = await AdminData.find({ type: "MODERATOR_LIST" });
  if (!moderatorListDoc) return false;
  if (!moderatorListDoc.data) return false;

  if (!moderatorListDoc.data.includes(req.user.username)) return false;

  return false;
}
