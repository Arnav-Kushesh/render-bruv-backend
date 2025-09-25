import Profile from '../database/models/Profile.js';

export default async function checkUsernameAvailability(username) {
  let profile = await Profile.findOne({ username });
  if (profile) return false;
  return true;
}
