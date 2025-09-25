export default function getUserDataForContent(userData) {
  return {
    _id: userData._id,
    email: userData.email,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    profileImage: userData.profileImage,
    gender: userData.gender,
    membershipType: userData.membershipType,
  };
}
