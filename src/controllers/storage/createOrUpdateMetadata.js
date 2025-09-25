import File from "../../database/models/File.js";

async function createOrUpdateMetadata({
  req,
  fileName,
  fileExtension,
  fileSize,
}) {
  let newFileMeta = new File();
  newFileMeta.actualExtension = fileExtension;
  newFileMeta.fileName = fileName;
  newFileMeta.size = fileSize;
  newFileMeta.authorUserId = req.user._id;
  await newFileMeta.save();

  return true;
}

//I removed logic for updating metadata because delete and creating new one is better than updating because
//updating has caching issues

export default createOrUpdateMetadata;
