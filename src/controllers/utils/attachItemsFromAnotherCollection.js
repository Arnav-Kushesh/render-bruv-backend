export default async function attachItemsFromAnotherCollection({
  Collection,
  localItems,
  localField,
  foreignField,
  as, //fieldToAddTo
}) {
  localItems = JSON.parse(JSON.stringify(localItems));
  let localKeyList = [];

  for (let item of localItems) {
    let value = item[localField];
    localKeyList.push(value);
  }

  let foreignItems = await Collection.find({
    [foreignField]: { $in: localKeyList },
  });
  foreignItems = JSON.parse(JSON.stringify(foreignItems));

  let foreignKeyVsForeignItems = {};

  for (let foreignItem of foreignItems) {
    let theKey = foreignItem[foreignField];
    foreignKeyVsForeignItems[theKey] = foreignItem;
  }

  for (let localItem of localItems) {
    let refID = localItem[localField];

    let foreignItem = foreignKeyVsForeignItems[refID];

    if (foreignItem) {
      localItem[as] = foreignItem;
    }
  }

  return localItems;
}
