import supportedGpuTypes from "../../../data/supportedGpuTypes.js";
import UserTransaction from "../../../database/models/money/UserTransaction.js";
import Profile from "../../../database/models/Profile.js";
import ServerInstance from "../../../database/models/ServerInstance.js";
import stopInstanceOnRunpod from "../../instance/runpod/stopInstanceOnRunpod.js";

//decrements Balance And Registers Usage On ServerPing
export default async function registerUsageOnServerPing(podId) {
  let serverInstance = await ServerInstance.findOne({ podId: podId });

  if (!serverInstance) throw Error("Server instance not found");

  let gpyTypeId = serverInstance.instanceGpuType;
  let gpuType = supportedGpuTypes[gpyTypeId];

  if (!gpuType) throw Error(`Invalid gpu type ${gpyTypeId} for podId ${podId}`);

  let author = await Profile.findOne({ _id: serverInstance.authorUserId });

  if (!author) throw Error("Author not found");

  let perMinutePrice = gpuType?.perMinutePrice;

  if (!perMinutePrice)
    throw Error(`Invalid gpu type ${gpyTypeId} for podId ${podId}`);

  if (author.currentBalanceInCents <= 0) {
    await stopInstanceOnRunpod(podId);
  } else {
    let newBalance = author.balance - perMinutePrice;

    await Profile.findOneAndUpdate(
      { _id: serverInstance.authorUserId },
      {
        $inc: {
          currentBalanceInCents: perMinutePrice * -1,
          totalMinutesUsed: 1,
        },
      }
    );

    await ServerInstance.findOneAndUpdate(
      { _id: serverInstance._id },
      {
        $inc: {
          minuteRan: 1,
          charges: perMinutePrice,
        },
      }
    );

    let newTransaction = new UserTransaction();
    newTransaction.type = "AMOUNT_DEDUCTED";
    newTransaction.authorUserId = author._id;
    newTransaction.amountInCents = perMinutePrice;
    newTransaction.podId = podId;
    newTransaction.balanceInCents = newBalance;
    await newTransaction.save();
  }
}
