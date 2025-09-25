export default function getSearchableText({ post, profile, loggedInUser }) {
  return prefixGeneratorForWordArray(
    getTheText({ post, profile, loggedInUser })
  );
}

function getTheText({ post, profile, loggedInUser }) {
  if (profile) {
    return getProfileText(profile);
  }

  if (post) {
    return [...getPostText(post), ...getProfileText(loggedInUser)];
  }

  return [];
}

function getProfileText(profile) {
  let words = [];

  breakSentenceAndAddToArray(words, profile.name);
  breakSentenceAndAddToArray(words, profile.country);
  breakSentenceAndAddToArray(words, profile.state);
  breakSentenceAndAddToArray(words, profile.address);
  breakSentenceAndAddToArray(words, profile.username);
  breakSentenceAndAddToArray(words, profile.founderName);
  breakSentenceAndAddToArray(words, profile.leaderName);
  breakSentenceAndAddToArray(words, profile.ngoType);
  breakSentenceAndAddToArray(
    words,
    getEducationText(profile.educationalBackground)
  );
  breakSentenceAndAddToArray(words, getWorkExpText(profile.workExperience));

  return words;
}

function getPostText(post) {
  let words = [];

  breakSentenceAndAddToArray(words, post.title);
  breakSentenceAndAddToArray(words, post.description);
  breakSentenceAndAddToArray(words, post.purpose);
  breakSentenceAndAddToArray(words, post.type);
  breakSentenceAndAddToArray(words, post.country);
  breakSentenceAndAddToArray(words, post.state);
  breakSentenceAndAddToArray(words, post.city);

  return words;
}

function getEducationText(obj) {
  if (!obj) return "";
  return Object.values(obj)
    .map((item) => item.instituteName) // get all instituteName values
    .filter(Boolean) // remove undefined/null if missing
    .join(" "); // join with spaces
}

function getWorkExpText(arr) {
  if (!arr) return "";
  return arr
    .map((item) => item.companyName) // pick companyName from each object
    .filter(Boolean) // remove empty/null values
    .join(" "); // join with spaces
}

//breaks each word into multiple words for better search
function prefixGeneratorForWordArray(items) {
  let newItems = [];

  for (let item of items) {
    if (item) {
      if (item.trim()) {
        let out = prefixGenerator(item);
        if (out.length) {
          newItems = [...newItems, ...out];
        }
      }
    }
  }

  return newItems.join(" ");
}

//It generates new words of different length that are prefix of the input
//This improves the search
//If input is apple
//You will get app, appl, apple
function prefixGenerator(word) {
  word = cleanText(word);
  if (!word) return [];

  if (word.length < 3) return [word];

  let result = [];
  for (let i = 3; i <= word.length; i++) {
    result.push(word.substring(0, i));
  }
  return result;
}

function cleanText(text) {
  if (!text) return "";
  return text.replace(/_/g, " ").toLowerCase();
}

function breakSentenceAndAddToArray(arr, text) {
  if (text) {
    arr.push(...text.toString().split(/\s+/).filter(Boolean));
  }
}
