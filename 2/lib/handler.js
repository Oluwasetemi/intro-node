/**
 * file createdBy Oluwasetemi Ojo
 */

const handler = {};

handler.home = (data, callback) => {
  // callback an http status code and a payload object
  callback(200, { name: 'hello world' });
};
handler.sample = (data, callback) => {
  // callback an http status code and a payload object
  callback(406, { name: 'sample handler' });
};

handler.ping = (data, callback) => {
  // callback with http status code and a payload object
  callback(200, { hey: 'working' });
};

handler.notFound = (data, callback) => {
  callback(404);
};
handler.hello = (data, callback) => {
  callback(200, { Hello: 'World' });
};

module.exports = handler;
