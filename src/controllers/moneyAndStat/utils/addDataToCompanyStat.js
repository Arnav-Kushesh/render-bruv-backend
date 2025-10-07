import CompanyStat from "../../../database/models/money/CompanyStat.js";

export default async function addDataToCompanyStat({ type, amount }) {
  await addDataCore({ durationType: "DATE", type, amount });
  await addDataCore({ durationType: "MONTH", type, amount });
  await addDataCore({ durationType: "YEAR", type, amount });
}

async function addDataCore({ durationType, type, amount }) {
  let date = generateDateString(durationType);

  let docExists = await CompanyStat.findOne({
    date,
    durationType,
    type,
    amount,
  });

  if (docExists) {
    await CompanyStat.findOneAndUpdate(
      { _id: docExists._id },
      { $inc: { amount } }
    );
  } else {
    let newDoc = new CompanyStat();
    newDoc.type = type;
    newDoc.durationType = durationType;
    newDoc.amount = amount;
    newDoc.date = date;

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
