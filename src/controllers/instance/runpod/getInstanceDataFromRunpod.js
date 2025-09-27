import ServerInstance from "../../../database/models/ServerInstance";

export default async function getInstanceDataFromRunpod(podId) {
  let serverInstance = await ServerInstance.findOne({ podId: podId });

  const podDataResponse = await fetch(
    `https://api.runpod.io/v1/pods/${POD_ID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
      },
    }
  );

  const podData = await podDataResponse.json();

  return { podData, serverInstance };
}
