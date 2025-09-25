export default async function updateDocument({
  initialDocument,
  changes,
  allowedFields,
  additionalChanges,
}) {
  if (!initialDocument) throw Error("Document not found");

  for (let field in changes) {
    let fieldType = allowedFields[field];
    let value = changes[field];

    if (fieldType == "number") {
      value = parseInt(value);
      if (isNaN(value)) value = 0;
    }

    if (value) {
      if (!fieldType) throw Error(`${field} is not supported`);

      if (typeof value !== fieldType) {
        throw Error(
          `${field} should be type ${fieldType} but was sent:${typeof value}`
        );
      }
    }

    updateDoc(field, value);
  }

  //For fields that a user is not allowed to change but was added by the backend itself
  if (additionalChanges) {
    for (let field in additionalChanges) {
      let value = additionalChanges[field];
      updateDoc(field, value);
    }
  }

  function updateDoc(field, value) {
    initialDocument[field] = value;
  }

  let newDoc = await initialDocument.save();

  return newDoc;
}
