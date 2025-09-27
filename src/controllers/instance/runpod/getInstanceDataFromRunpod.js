export default async function getInstanceDataFromRunpod(podId) {
  const podDataResponse = await fetch(
    `https://rest.runpod.io/v1/pods/${podId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
      },
    }
  );

  const podData = await podDataResponse.json();

  console.log("podData", podData, podId);

  return { podData };
}
