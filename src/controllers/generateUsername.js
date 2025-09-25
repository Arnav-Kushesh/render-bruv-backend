import randomWords from 'random-words';
let { generate } = randomWords;

import checkUsernameAvailability from './checkUsernameAvailability.js';

export default async function generateUsername(name, attemptCount) {
  name = name.toLowerCase();
  if (!attemptCount) attemptCount = 0;

  let random = getFourDigitRandom();
  let cleanedName = removeSpecialCharacters(name);
  cleanedName = cleanedName.substring(0, 10); //to total username length less than 15
  let username = cleanedName + random;
  if (attemptCount) username = cleanedName + generate() + random;
  let available = await checkUsernameAvailability(username);
  if (available) return username;
  let anotherUsername = await generateUsername(name, attemptCount + 1);
  return anotherUsername.toLowerCase();
}

function getFourDigitRandom() {
  //if random generated is less than three then we must prefix with 0
  let lengthOfSuffix = 9999;
  let random = Math.round(Math.random() * lengthOfSuffix);
  let str = '0000' + random;
  return str.substring(str.length - 4);
}

function removeSpecialCharacters(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}
