import supportedGpuTypes from "../../../data/supportedGpuTypes.js";
import ServerInstance from "../../../database/models/ServerInstance.js";

export default async function stopInstanceOnRunpod(podId) {
  let instance = await ServerInstance.findOne({ podId });

  if (!instance) throw Error("There is an error");

  let gpuType = supportedGpuTypes[instance.instanceGpuType];

  const response = await fetch(`https://rest.runpod.io/v1/pods/${podId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.statusText == "Not Found") {
      console.log("Pod already terminated");
    } else {
      throw new Error(`Failed to terminate pod: ${response.statusText}`);
    }
  }

  //   const result = await response.json();

  instance.status = "TERMINATED";
  instance.stoppedAt = new Date();
  let totalMinutesRan = differenceInMinutes(instance.startedAt, Date.now());
  instance.costEstimatedAtTermination =
    totalMinutesRan * gpuType.perMinutePrice;
  await instance.save();

  if (instance.costEstimatedAtTermination !== instance.charges) {
    console.log(
      `Pricing Mismatch warning ${podId}`,
      `Estimated cost At Termination: ${instance.costEstimatedAtTermination}`,
      `Charges Accumulated Over Time: ${instance.charges}`
    );
  }
  //   return result;
}

function differenceInMinutes(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const diffMs = Math.abs(d2 - d1); // difference in milliseconds
  return Math.floor(diffMs / (1000 * 60)); // convert ms to minutes
}
