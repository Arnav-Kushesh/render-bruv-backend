import Report from "../../../database/models/Report.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";
import attachAuthorToDocs from "../utils/attachAuthorToDocs.js";

export default async function getReports(req, res, next) {
  if (!req.user) return next("Login Required");

  let isAllowed = await checkModeratorAccess(req);
  if (!isAllowed) return next("Permission Denied");

  try {
    let sortQuery = { createdAt: -1 };

    const filter = {};

    await handlePagination({
      req,
      res,
      Collection: Report,
      query: filter,
      processData,
      sortQuery,
    });
  } catch (err) {
    next(err);
  }

  async function processData(items) {
    items = await attachAuthorToDocs(items);
    return items;
  }
}
