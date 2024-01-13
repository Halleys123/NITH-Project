const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  try {
    salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  } catch (err) {
    throw err;
  }
};
module.exports = hashPassword;
