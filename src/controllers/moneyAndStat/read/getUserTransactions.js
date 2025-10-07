import UserTransaction from "../../../database/models/money/UserTransaction.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";
import attachAuthorToDocs from "../../api/utils/attachAuthorToDocs.js";
import handlePagination from "../../utils/handlePagination.js";

export default async function getUserTransactions(req, res, next) {
  if (!req.user) return next("Login Required");

  try {
    let sortQuery = { createdAt: -1 };

    const filter = {};

    if (req.query.showMyData) {
      filter.userId = req.user._id;
    } else if (req.query.podId) {
      filter.podId = req.query.podId;
    } else {
      let hasAccess = await checkModeratorAccess(req);
      if (!hasAccess) return next("Permission Denied");
    }

    await handlePagination({
      req,
      res,
      Collection: UserTransaction,
      query: filter,
      processData,
      sortQuery,
    });
  } catch (err) {
    next(err);
  }

  async function processData(items) {
    items = await attachAuthorToDocs(items, "userId", "user");
    return items;
  }
}
