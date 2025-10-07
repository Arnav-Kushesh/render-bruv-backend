import CompanyTransaction from "../../../database/models/money/CompanyTransaction.js";
import RechargeHistory from "../../../database/models/money/RechargeHistory.js";
import UserTransaction from "../../../database/models/money/UserTransaction.js";
import Profile from "../../../database/models/Profile.js";
import addDataToCompanyStat from "../utils/addDataToCompanyStat.js";

export default async function registerRecharge({
  userId,
  amountInCents,
  transactionId,
  paymentFacilitator = "DODO_PAYMENT",
}) {
  await incrementBalanceInProfile({ userId, amountInCents });
  await addDocInRechargeHistory({
    userId,
    amountInCents,
    transactionId,
    paymentFacilitator,
  });
  await addDocInUserTransactions({
    userId,
    amountInCents,
    transactionId,
    paymentFacilitator,
  });
  await addDocsInCompanyTransactions({
    userId,
    amountInCents,
    transactionId,
    paymentFacilitator,
  });
}

async function incrementBalanceInProfile({ userId, amountInCents }) {
  const result = await Profile.findOneAndUpdate(
    { _id: userId },
    { $inc: { currentBalanceInCents: amountInCents } }
  );

  if (!result) {
    throw Error(
      `Can't find the profile doc for ${userId} for balance updating`
    );
  }
}

async function addDocInRechargeHistory({
  userId,
  amountInCents,
  transactionId,
  paymentFacilitator,
}) {
  let newDoc = new RechargeHistory();
  newDoc.userId = userId;
  newDoc.amountInCents = amountInCents;
  newDoc.transactionId = transactionId;
  newDoc.paymentFacilitator = paymentFacilitator;

  await newDoc.save();
}

async function addDocInUserTransactions({
  userId,
  amountInCents,
  transactionId,
  paymentFacilitator,
}) {
  let user = await Profile.findOne({ _id: userId });

  if (!user) {
    throw Error("Can't find user to balance reading");
  }

  let newDoc = new UserTransaction();
  newDoc.type = "AMOUNT_ADDED";
  newDoc.userId = userId;
  newDoc.amountInCents = amountInCents;
  newDoc.transactionId = transactionId;
  newDoc.paymentFacilitator = paymentFacilitator;
  newDoc.balanceInCents = user.currentBalanceInCents;
  await newDoc.save();
}

async function addDocsInCompanyTransactions({
  userId,
  amountInCents,
  transactionId,
  paymentFacilitator,
}) {
  let currentPendingExpenses = 0;
  let currentWithdrawableAmount = 0;

  let latestDoc = await CompanyTransaction.findOne().sort({ createdAt: -1 });

  if (latestDoc) {
    if (latestDoc.withdrawableAmount) {
      currentWithdrawableAmount = latestDoc.withdrawableAmount;
    }

    if (latestDoc.pendingExpenses) {
      currentPendingExpenses = latestDoc.pendingExpenses;
    }
  }

  let profit = amountInCents / 2;
  let expense = amountInCents / 2;

  let newPendingExpenses = currentPendingExpenses + expense;
  let newWithdrawableAmount = currentWithdrawableAmount + profit;

  await addRevenueDocToCompanyTransactions({
    userId,
    amountInCents,
    transactionId,
    paymentFacilitator,
    newPendingExpenses,
    newWithdrawableAmount,
  });

  await addPendingExpenseDocToCompanyTransactions({
    userId,
    amountInCents,
    transactionId,
    paymentFacilitator,
    newPendingExpenses,
    newWithdrawableAmount,
  });

  await addProfitDocToCompanyTransactions({
    userId,
    amountInCents,
    transactionId,
    paymentFacilitator,
    newPendingExpenses,
    newWithdrawableAmount,
  });
}

//Company Transactions
async function addRevenueDocToCompanyTransactions({
  userId,
  amountInCents,
  transactionId,
  paymentFacilitator,
  newPendingExpenses,
  newWithdrawableAmount,
}) {
  await addDataToCompanyStat({ type: "REVENUE", amount: amountInCents });

  let newDoc = new CompanyTransaction();
  newDoc.type = "REVENUE";
  newDoc.userId = userId;
  newDoc.amountInCents = amountInCents;
  newDoc.transactionId = transactionId;
  newDoc.paymentFacilitator = paymentFacilitator;
  newDoc.pendingExpenses = newPendingExpenses;
  newDoc.withdrawableAmount = newWithdrawableAmount;
  await newDoc.save();
}

async function addPendingExpenseDocToCompanyTransactions({
  userId,
  amountInCents,
  transactionId,
  paymentFacilitator,
  newPendingExpenses,
  newWithdrawableAmount,
}) {
  await addDataToCompanyStat({
    type: "PENDING_EXPENSE",
    amount: amountInCents,
  });

  let newDoc = new CompanyTransaction();
  newDoc.type = "PENDING_EXPENSE";
  newDoc.userId = userId;
  newDoc.amountInCents = amountInCents;
  newDoc.transactionId = transactionId;
  newDoc.paymentFacilitator = paymentFacilitator;
  newDoc.pendingExpenses = newPendingExpenses;
  newDoc.withdrawableAmount = newWithdrawableAmount;
  await newDoc.save();
}

async function addProfitDocToCompanyTransactions({
  userId,
  amountInCents,
  transactionId,
  paymentFacilitator,
  newPendingExpenses,
  newWithdrawableAmount,
}) {
  await addDataToCompanyStat({ type: "PROFIT", amount: amountInCents });

  let newDoc = new CompanyTransaction();
  newDoc.type = "PROFIT";
  newDoc.userId = userId;
  newDoc.amountInCents = amountInCents;
  newDoc.transactionId = transactionId;
  newDoc.paymentFacilitator = paymentFacilitator;
  newDoc.pendingExpenses = newPendingExpenses;
  newDoc.withdrawableAmount = newWithdrawableAmount;
  await newDoc.save();
}
