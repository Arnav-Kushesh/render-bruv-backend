import supportedGpuTypes from "../../../data/supportedGpuTypes";
import CreditTransaction from "../../../database/models/money/CreditTransaction";
import Profile from "../../../database/models/Profile";
import ServerInstance from "../../../database/models/ServerInstance";
import stopInstanceOnRunpod from "./stopInstanceOnRunpod";

export default async function decrementBalanceAndRegisterUsageOnServerPing(
  podId
) {
  let serverInstance = await ServerInstance.findOne({ podId: podId });

  if (!serverInstance) throw Error("Server instance not found");

  let gpuType = supportedGpuTypes[serverInstance.instanceGpuType];

  let author = await Profile.findOne({ _id: serverInstance.authorUserId });

  if (!author) throw Error("Author not found");

  let gpyTypeId = serverInstance.instanceGpuType;
  let price = supportedGpuTypes[gpyTypeId]?.price;

  if (!price) throw Error(`Invalid gpu type ${gpyTypeId} for podId ${podId}`);

  if (author.balance <= 0) {
    await stopInstanceOnRunpod(podId);
  } else {
    let newBalance = author.balance - price;
    Profile.findOneAndUpdate(
      { _id: serverInstance.authorUserId },
      { balance: newBalance }
    );

    //
    serverInstance.minuteRan += 1;
    serverInstance.charges += gpuType.perMinutePrice;
    await serverInstance.save();

    let newTransaction = new CreditTransaction();
    newTransaction.authorUserId = author._id;
    newTransaction.amountDeducted = price;
    newTransaction.podId = podId;
    newTransaction.balance = newBalance;
    await newTransaction.save();
  }
}
