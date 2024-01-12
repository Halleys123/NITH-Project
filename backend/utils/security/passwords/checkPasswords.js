const bcrypt = require("bcrypt");
const checkPasswords = async (enteredPassword, databasePassword) => {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, databasePassword);
    return isMatch;
  } catch (err) {
    throw err;
  }
};
module.exports = checkPasswords;
