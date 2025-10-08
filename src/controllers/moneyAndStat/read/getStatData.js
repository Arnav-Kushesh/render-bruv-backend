import Stat from "../../../database/models/money/Stat.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";
import handlePagination from "../../utils/handlePagination.js";

export default async function getStatData(req, res, next) {
  if (!req.user) return next("Login Required");

  if (!req.query.type) {
    let hasAccess = await checkModeratorAccess(req);
    if (!hasAccess) return next("Permission Denied");
  }

  if (!req.query.type.indexOf("USER") !== -1) {
    let hasAccess = await checkModeratorAccess(req);
    if (!hasAccess) return next("Permission Denied");
  }

  try {
    let sortQuery = { createdAt: -1 };

    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.durationType) {
      filter.durationType = req.query.durationType;
    }

    await handlePagination({
      req,
      res,
      Collection: Stat,
      query: filter,
      sortQuery,
    });
  } catch (err) {
    next(err);
  }
}
