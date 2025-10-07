export default async function handlePagination({
  req,
  Collection,
  query,
  res,
  defaultItemsPerPage = 10,
  processData,
  additionalDataToSend = {},

  sortQuery = { createdAt: -1 },
}) {
  if (!additionalDataToSend) additionalDataToSend = {};
  let { itemsPerPage, currentPage } = req.query;

  if (!itemsPerPage) itemsPerPage = defaultItemsPerPage;

  if (req.query.forExport) {
    itemsPerPage = 90000;
  }

  if (!currentPage) currentPage = 0;

  itemsPerPage = parseInt(itemsPerPage);
  currentPage = parseInt(currentPage);

  try {
    let maxDocuments = await Collection.countDocuments(query);

    let maxPages = maxDocuments / itemsPerPage;

    let items = await Collection.find(query)
      .sort(sortQuery)
      .skip(currentPage * itemsPerPage)
      .limit(itemsPerPage);

    if (processData) {
      items = JSON.parse(JSON.stringify(items)); // This will remove $isnew and indent
      items = await processData(items);
    }

    res.status(200).json({
      success: true,
      data: {
        totalDocuments: maxDocuments,
        list: items,
        maxPages: Math.ceil(maxPages),
        ...additionalDataToSend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
