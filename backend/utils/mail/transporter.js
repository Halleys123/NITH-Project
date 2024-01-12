const nodemailer = require("nodemailer");
const createTransporter = () => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireSSL: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
    return transporter;
  } catch (err) {
    throw err;
  }
};
module.exports = createTransporter;
