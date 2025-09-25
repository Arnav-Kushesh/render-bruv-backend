import createUserCore from "./createUserCore.js";

async function createUser(data) {
  let payload = data.userInfo;
  let picture = payload.picture;

  return await createUserCore({
    email: payload.email,
    googleID: payload.id,
    emailConfirmed: true,
  });
}

export default createUser;
