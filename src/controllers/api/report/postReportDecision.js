import Content from "../../../database/models/Content.js";
import Profile from "../../../database/models/Profile.js";
import Report from "../../../database/models/Report.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";

export default async function postReportDecision(req, res, next) {
  if (!req.user) return next("Login Required");

  let isAllowed = await checkModeratorAccess(req);
  if (!isAllowed) return next("Permission Denied");

  let { itemId, itemType, action } = req.body;

  let item = null;

  if (itemType == "PROFILE") {
    item = await Profile.findByIdAndUpdate(itemId);
  } else if (itemType == "CONTENT") {
    item = await Content.findByIdAndUpdate(itemId);
  } else {
    return next("Invalid item type");
  }

  if (action == "BAN") {
    item.isBanned = true;
    item.bannedAt = new Date();
  } else if (action == "IGNORE") {
    //Do nothing
    item.hasNewReports = false;
  } else {
    return next("Invalid Action");
  }

  Report.updateMany(
    { subjectID: itemId },
    {
      $set: {
        status: "REVIEWED",
      },
    }
  );

  item.pendingReportCount = await Content.countDocuments({
    subjectID: itemId,
    status: "PENDING",
  });
  item.totalReportCount = await Content.countDocuments({
    subjectID: itemId,
  });

  await item.save();

  return res.json({ data: true });
}
