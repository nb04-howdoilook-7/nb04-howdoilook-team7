import sgMail from '@sendgrid/mail';
import { SENDER_EMAIL, SENDGRID_API_KEY } from './constants.js';
import type { SendEmail } from '../types/shared.types.js';

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendEmail({ to, subject, text }: SendEmail) {
  const mailOptions = {
    from: SENDER_EMAIL,
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
