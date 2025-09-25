export default function lexicalObjToString(theObj, isNotFirstCall) {
  if (!theObj) return '';

  if (!isNotFirstCall) {
    let main = null;
    if (theObj.root) {
      if (theObj.root.children) {
        main = theObj.root.children;
      }
    }

    if (!main) return '';

    theObj = main;
  }

  let textContent = '';

  if (!Array.isArray(theObj)) return textContent;

  for (let item of theObj) {
    if (item.text) {
      textContent += item.text + ' ';
    }

    if (item.children) {
      textContent += lexicalObjToString(item.children, true);
    }
  }

  return textContent;
}
