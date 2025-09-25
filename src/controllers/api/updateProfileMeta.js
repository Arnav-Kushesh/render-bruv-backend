import getProfileMeta from './getProfileMeta.js';

let allowedTypes = ['WORKER', 'CLIENT'];

export default async function updateProfileMeta(req, res, next) {
  if (!req.user) return next('Login Required');

  let changes = req.body.changes;
  let profileID = req.user._id.toString();

  let profileMeta = await getProfileMeta(profileID);

  try {
    for (let field in changes) {
      await updateUserObject(field, changes[field]);
    }
  } catch (e) {
    return next(e);
  }

  async function updateUserObject(field, value) {
    if (!field) return next('field is required');

    let allowedFields = {
      pinnedItems: 'object',
      contentOrder: 'object',
    };

    if (!allowedFields[field]) throw Error('Invalid field ' + field);

    if (!value) {
      value = null;
      if (allowedFields[field] === 'boolean') value = false;
    } else {
      if (allowedFields[field] !== typeof value)
        throw Error('invalid type of ' + field);
    }

    profileMeta[field] = value;
  }

  try {
    let newDoc = await profileMeta.save();
    return res.json({ data: newDoc });
  } catch (e) {
    return next(e);
  }
}
