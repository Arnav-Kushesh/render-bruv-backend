import Stat from "../../../database/models/money/Stat.js";

export default async function addDataStatCollection({ type, amount, userId }) {
  await addDataCore({ durationType: "DATE", type, amount, userId });
  await addDataCore({ durationType: "MONTH", type, amount, userId });
  await addDataCore({ durationType: "YEAR", type, amount, userId });
}

async function addDataCore({ durationType, type, amount, userId }) {
  let date = generateDateString(durationType);

  let findQuery = {
    date,
    durationType,
    type,
  };

  if (userId) findQuery.userId = userId;

  let docExists = await Stat.findOne(findQuery);

  if (docExists) {
    await Stat.findOneAndUpdate({ _id: docExists._id }, { $inc: { amount } });
  } else {
    let newDoc = new Stat();
    newDoc.type = type;
    newDoc.durationType = durationType;
    newDoc.amount = amount;
    newDoc.date = date;
    if (userId) newDoc.userId = userId;
    await newDoc.save();
  }
}

function generateDateString(type) {
  const now = new Date();
  let date;

  if (type === "DATE") {
    date = now;
  } else if (type === "MONTH") {
    date = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (type === "YEAR") {
    date = new Date(now.getFullYear(), 0, 1);
  } else {
    throw new Error("Invalid type. Use 'date', 'month', or 'year'.");
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${yyyy}/${mm}/${dd}`;
}
