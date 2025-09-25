import Profile from "../../../database/models/Profile.js";

/**
 * Add author profile data to docs.
 * @param {Array<Object>} docs - doc objects.
 * @returns {Promise<Array<Object>>} docs with `author` field.
 */

export default async function attachAuthorToDocs(docs, fieldForAuthor, as) {
  if (!docs.length) return docs;

  docs = docs.filter((value) => value !== null);
  docs = JSON.parse(JSON.stringify(docs));

  if (!as) as = "author";

  if (!fieldForAuthor) fieldForAuthor = "authorUserId";

  const authorIDs = [
    ...new Set(docs.map((c) => c[fieldForAuthor]?.toString())),
  ];
  const authors = await Profile.find({ _id: { $in: authorIDs } }).lean();
  const authorMap = new Map(authors.map((a) => [a._id.toString(), a]));

  return docs.map((doc) => ({
    ...doc,
    [as]: authorMap.get(doc[fieldForAuthor]?.toString()) || null,
  }));
}
