import supportedGpuTypes from "../../../data/supportedGpuTypes.js";
import registerInstanceInDatabase from "./registerInstanceInDatabase.js";

export default async function createInstanceOnRunpod({
  loggedInUser,
  projectName,
  internalGpuId,
}) {
  const BASE_URL = "https://rest.runpod.io/v1";
  let RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;

  let runpodGpuId = supportedGpuTypes[internalGpuId]?.runpodId;

  if (!runpodGpuId) throw Error(`Invalid gpuId ${runpodGpuId}`);

  try {
    // Example config — you can also take these from req.body
    const body = {
      cloudType: "SECURE",
      name: `${loggedInUser._id}-${loggedInUser.username}-pod`,
      imageName: "merahulahire/cloud-blender-render",
      gpuTypeIds: [runpodGpuId],
      //   numGpus: 1,
      volumeMountPath: "/workspace",
      ports: ["4000/http", "8888/http", "22/tcp", "443/tcp"],
      volumeInGb: 20,
      containerDiskInGb: 50, //This is assigned to /workspace
      env: {
        userId: loggedInUser._id,
      },
    };

    const response = await fetch(`${BASE_URL}/pods`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RUNPOD_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const runpodData = await response.json();

    if (runpodData.error) {
      throw Error(runpodData.error);
    }

    console.log(runpodData, body);
    // console.log("instanceData", instanceData);

    const podId = runpodData.id;

    let serverInstance = await registerInstanceInDatabase({
      userId: loggedInUser._id,
      podId: podId,
      projectName,
      gpyId: internalGpuId,
    });

    return { serverInstance, runpodData };
  } catch (error) {
    console.error(error);
    throw Error(error.message);
    // res.status(500).json({ error: "Failed to create pod" });
  }
}
