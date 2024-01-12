const jwt = require("jsonwebtoken");
const createJwt = (payload, secret, options) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, secret, options);
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = createJwt;
