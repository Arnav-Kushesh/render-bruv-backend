import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { nanoid } from "nanoid";

import createOrUpdateMetadata from "./storage/createOrUpdateMetadata.js";
import captureStorageUsage from "./storage/captureStorageUsage.js";
import handleSystemActivity from "./systemActivity/handleSystemActivity.js";

const region = "ap-south-1";

const bucketName = "ta-naz-storage";
const accessKeyId = process.env.AWS_S3_USER_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_USER_SECRET_KEY;

let clientParams = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
};

const client = new S3Client(clientParams);

async function getS3UploadUrl(req, res, next) {
  if (!req.user) return next("Login is required");
  if (!req.query.fileSize) return next("fileSize missing");
  if (!req.query.fileExtension) return next("fileExtension missing");

  let fileExtension = req.query.fileExtension;
  let fileSize = req.query.fileSize;
  let allowedExtension = ["jpg", "png", "jpeg", "pdf"];

  let allowed = await handleSystemActivity({
    loggedInUserId: req.user._id,
    type: "UPLOAD",
  });

  if (!allowed) return next("You have exceeded your upload quota");

  if (!allowedExtension.includes(fileExtension))
    return next("File type not supported");

  const randomName = nanoid();

  let fileName = `${req.user._id}/${randomName}.${fileExtension}`;

  createOrUpdateMetadata({ req, fileName, fileSize, fileExtension });
  captureStorageUsage(req, fileSize);

  const imageName = `${process.env.ENV_TYPE.toLowerCase()}/karuna/${fileName}`;

  const putObjectParams = {
    Bucket: bucketName,
    Key: imageName,
    ContentLength: fileSize,
  };

  const command = new PutObjectCommand(putObjectParams);
  const uploadURL = await getSignedUrl(client, command, { expiresIn: 180 });

  return res.json({ data: { fileName, uploadURL } });
}

export default getS3UploadUrl;
