import adminAccess from "../../../data/adminAccess.js";
import AdminData from "../../../database/models/AdminData.js";

export default async function addOrEditAdminData(req, res, next) {
  if (!req.user) return next("Login required");

  if (!adminAccess.includes(req.user.username))
    return next("Permission Denied");

  let { data, type } = req.body;

  if (type == "MODERATOR_LIST") {
    if (!Array.isArray(data)) return next("Data should be array");
  }

  let existingItem = await AdminData.findOne({ type: type });

  if (existingItem) {
    existingItem.data = data;
    await existingItem.save();
  } else {
    let newItem = new AdminData();
    newItem.type = type;
    newItem.data = data;
    await newItem.save();
  }

  return res.json({ data: true });
}
