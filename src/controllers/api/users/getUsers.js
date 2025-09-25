import MembershipPlan from "../../../database/models/MembershipPlan.js";
import Profile from "../../../database/models/Profile.js";

export default async function getUsers(req, res, next) {
  let { minAge, maxAge, membershipType, gender, page, membershipPlanID } =
    req.query;

  let limit = 100;
  let query = {};

  if (membershipPlanID) {
    if (membershipPlanID !== "ALL") query.membershipPlanID = membershipPlanID;
  }

  if (membershipType) {
    query.membershipType = membershipType;
  }

  if (gender) {
    if (gender !== "ALL") query.gender = gender;
  }

  let item = await Profile.find(query)
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit);

  return res.json({ data: item });
}

function calculateDOB(age) {
  age = parseInt(age);
  if (typeof age !== "number" || age < 0) {
    throw new Error(`Please provide a valid age as a positive number. ${age}`);
  }

  const currentDate = new Date();
  const birthYear = currentDate.getFullYear() - age;

  // Assume the person was born on January 1st for simplicity
  const dob = new Date(birthYear, 0, 1);

  return dob.toISOString().split("T")[0]; // Format as YYYY-MM-DD
}
