const crypto = require("crypto");

const createSecrets = () => {
  const secret = crypto.randomBytes(32).toString("hex");
  console.log(secret);
};

createSecrets();
