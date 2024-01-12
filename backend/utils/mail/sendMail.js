const transporter = require("./transporter")();
const sendMail = (text, subject, from_info, toSendMail) => {
  let mailOptions = {
    from: `${from_info} <${process.env.EMAIL}>`,
    to: toSendMail,
    subject: `${subject}`,
    // text:`${text}`,
    html: text,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw err;
    } else {
      return info;
    }
  });
};
module.exports = sendMail;
