module.exports.isValidEmail = (email) => {
  const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailPattern.test(email);
};
module.exports.isValidPassword = (password, length) => {
  return password.length >= length;
};
