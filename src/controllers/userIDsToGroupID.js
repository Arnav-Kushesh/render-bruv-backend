export default function userIdsToGroupID(id1, id2) {
  id1 = id1.toString();
  id2 = id2.toString();

  let theList = [id1, id2];

  theList.sort();

  let newString = `${theList[0]}-${theList[1]}`;

  return newString;
}
