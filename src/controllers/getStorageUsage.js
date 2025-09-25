function getStorageUsage(req) {
  if (!req.user) throw Error('user not logged in');
  let fieldName = 'storageUsage';
  return req.user[fieldName];
}

export default getStorageUsage;
