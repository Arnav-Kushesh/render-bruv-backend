import Content from "../../../database/models/Content.js";
import attachAuthorToDocs from "./attachAuthorToDocs.js";

export default async function attachContentToDocs({ docs, loggedInUser }) {
  if (!docs.length) return docs;

  docs = JSON.parse(JSON.stringify(docs));

  let fieldForContentID = "contentID";

  const contentIDs = [
    ...new Set(docs.map((c) => c[fieldForContentID]?.toString())),
  ];

  const contents = await Content.find({ _id: { $in: contentIDs } }).lean();

  contents = await attachAuthorToDocs(contents);

  if (loggedInUser) {
    contents = await attachLikeStatusToDocs(contents, loggedInUser._id);
  }

  const contentMap = new Map(contents.map((a) => [a._id.toString(), a]));

  return docs.map((doc) => ({
    ...doc,
    content: contentMap.get(doc[fieldForContentID]?.toString()) || null,
  }));
}
