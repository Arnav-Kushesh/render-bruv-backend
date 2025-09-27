import supportedGpuTypes from "../../data/supportedGpuTypes.js";
import createInstanceOnRunpod from "./runpod/createInstanceOnRunpod.js";

export default async function createServerInstance(req, res, next) {
  try {
    let loggedInUser = req.user;

    if (!loggedInUser) return next("Login required");

    let { projectName, gpuId } = req.body;

    if (!projectName) return next("ProjectName is required");

    if (!gpuId) return next("gpuId is required");

    let gpuType = supportedGpuTypes[gpuId];

    if (!gpuType) return next(`Invalid gpuId ${gpuId}`);

    let data = await createInstanceOnRunpod({
      loggedInUser,
      projectName,
      internalGpuId: gpuId,
    });

    return res.json({ data: data });
  } catch (e) {
    console.log(e);
    return res.json({ error: e.message });
  }
}
