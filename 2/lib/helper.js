/**
 *
 * HELPERS
 * Author: Oluwasetemi Ojo
 * Date: 10/05/2020
 */

//  dependencies
const crypto = require('crypto');
const config = require('./config');

// declare helpers
const helpers = {};

// create a SHA256 hash
helpers.hash = str => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');
    return hash;
  }
  return false;
};

// parse a JSON to an object in all cases without throwing a error
helpers.parseJSONtoObject = str => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (error) {
    return {};
  }
};

// create a string of a given length of random alpha-numeric characters
helpers.createRandomString = strLength => {
  // eslint-disable-next-line no-param-reassign
  strLength =
    typeof strLength === 'number' && strLength > 0 ? strLength : false;

  if (strLength) {
    // define all the possible characters that could go into a string
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // start the string
    let str = '';

    for (let i = 0; i < strLength; i += 1) {
      // get a random character from the possibleCharacters string
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      // append this character to the str
      str += randomCharacter;
    }

    return str;
  }
  return false;
};
// export helpers
module.exports = helpers;
