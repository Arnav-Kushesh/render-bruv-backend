import ServerInstance from "../../../database/models/ServerInstance";

export default async function registerInstanceInDatabase({
  podId,
  userId,
  gpyId,
  projectName,
}) {
  let serverInstance = new ServerInstance();
  serverInstance.podId = podId;
  serverInstance.authorUserId = userId;
  serverInstance.instanceGpuType = gpyId;
  serverInstance.startedAt = new Date();
  serverInstance.projectName = projectName;

  await serverInstance.save();
}
