import Content from "../../../database/models/Content.js";
import handlePagination from "../../utils/handlePagination.js";
import attachAuthorToDocs from "../utils/attachAuthorToDocs.js";
import attachLikeStatusToDocs from "../utils/attachLikeStatusToDocs.js";

export default async function getFeedItems(req, res, next) {
  try {
    let sortQuery = { createdAt: -1 };

    const filter = { isDeleted: false, isBanned: false };

    if (req.query.purpose) filter.purpose = req.query.purpose;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city) filter.city = req.query.city;

    if (req.query.searchQuery) {
      filter["$text"] = { $search: req.query.searchQuery };
      sortQuery = null;
    }

    if (req.query.userId) {
      filter.authorUserId = req.query.userId;
    }

    if (req.query.hasNewReports) {
      filter.hasNewReports = true;
      sortQuery = { pendingReports: -1 };
    }

    await handlePagination({
      req,
      res,
      Collection: Content,
      query: filter,
      processData,
      sortQuery,
    });
  } catch (err) {
    next(err);
  }

  async function processData(items) {
    // Attach author
    items = await attachAuthorToDocs(items);

    //  Attach like status (if logged in)
    if (req.user) {
      items = await attachLikeStatusToDocs(items, req.user._id);
    }

    return items;
  }
}
