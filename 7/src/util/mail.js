const juice = require('juice');
const pug = require('pug');
const htmlToText = require('html-to-text');
const path = require('path');

const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

// const nodemailer = require('nodemailer');

/* const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}); */

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    path.join(__dirname, `/templates/${filename}.pug`),
    options
  );
  const inlined = juice(html);
  return inlined;
};

/**
 * send email
 * @param {obj} options includes the filename, to, subject, variables to use in the email template
 * @example await send({
 *      filename: 'emailTemplate',
 *      to: recipients email,
 *      subject: 'hello',
 *      data1: value1,
 *      data2: value2,
 *      data3: value3,
 * })
 * @returns {obj} result of sending mail and the message (mail content)
 */
exports.send = async options => {
  try {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
      From: {
        Email: process.env.SMTP_FROM_EMAIL,
        Name: process.env.SMTP_FROM_NAME
      },
      To: [{ Email: options.to, Name: 'Adefams Group' }],
      Subject: options.subject || 'XXXXXXX-XXXX',
      TextPart: text,
      HTMLPart: html
    };

    const result = await mailjet
      .post('send', { version: 'v3.1' })
      .request({ Messages: [mailOptions] });

    return { result, message: text };
  } catch (error) {
    console.log(error.message);
    throw new Error('problem sending email📪');
  }
};

const makeANiceEmail = text => `
    <div class="email" styles="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <h2>Thank you for signing up!</h2>
        <p>${text}</p>

        <p>🤟🏼, Temi</p>
    </div>
`;

// exports.transport = transport;
// exports.makeANiceEmail = makeANiceEmail;

/* const mailRes = await transport.sendMail({
      from: 'temi@oluwasetemi.dev',
      to: [user.email],
      subject: 'Registration Successful',
      html: makeANiceEmail(`
            Your password Reset Token is here! \n\n
            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to Reset</a>.
            \n
            NB - Copy below otherwise ${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}
          `)
    }); */
