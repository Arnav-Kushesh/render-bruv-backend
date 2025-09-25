import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";
import handleActivity from "./activity/handleActivity.js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_API_KEY,
  fetch: nodeFetch,
});

let searchUnsplash = async (req, res, next) => {
  if (!req.user) return next("Login Required!");

  let allowed = await handleActivity({
    loggedInUserId: req.user._id,
    type: "SEARCH_UNSPLASH",
  });

  if (!allowed) return next("You have exceeded your image search quota");

  let result = await unsplash.search.getPhotos({
    page: 1,
    perPage: 30,
    orientation: "landscape",
    query: req.query.query,
  });

  if (result.errors) return next(result.errors[0]);

  res.json({ data: result.response });
};

export default searchUnsplash;
