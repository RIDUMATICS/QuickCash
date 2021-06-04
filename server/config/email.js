import sgMail from '@sendgrid/mail';
import config from '.';

sgMail.setApiKey(config.SENDGRID_API_KEY);

const sendMail = async (to, subject, message) => {
  const msg = {
    to,
    from: {
      email: 'support@quickcash.com',
      name: 'QuickCashSupport ',
    },
    subject,
    html: message,
  };
  // don't send mail in test mode
  if (process.env.NODE_ENV !== 'test') await sgMail.send(msg);
};

export default sendMail;
