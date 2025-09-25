import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text,
  };

  try {
    // const info = await transporter.sendMail(mailOptions);
    const info = await sgMail.send(mailOptions);
    console.log('Email sent: ' + info[0]);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('이메일 발송에 실패했습니다.');
  }
}

export default sendEmail;
