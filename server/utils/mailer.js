const SibApiV3Sdk = require('@sendinblue/client');
require('dotenv').config();

/* -------------------- CONFIG -------------------- */

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const SENDER = {
  email: process.env.MAIL_FROM || 'abishek.cs21@bitsathy.ac.in',
  name: 'PM Internship Scheme'
};

/* -------------------- CORE EMAIL -------------------- */

async function sendEmail({
  to,
  subject,
  html,
  text = null,
}) {
  const email = new SibApiV3Sdk.SendSmtpEmail();

  email.sender = SENDER;
  email.to = [{ email: to }];
  email.subject = subject;
  email.htmlContent = html;

  if (text) email.textContent = text;

  return apiInstance.sendTransacEmail(email);
}

/* -------------------- RETRY -------------------- */

async function sendWithRetry(payload, retries = 3) {
  let lastError;

  for (let i = 1; i <= retries; i++) {
    try {
      return await sendEmail(payload);
    } catch (err) {
      lastError = err;
      console.error(`❌ Attempt ${i} failed`);

      if (i < retries) {
        await new Promise(r => setTimeout(r, 2 ** i * 1000));
      }
    }
  }

  throw lastError;
}

/* -------------------- EXPORTS -------------------- */

module.exports = {

  /* ---------- OTP ---------- */
  sendOtp: async (email, otp) => {
    return sendWithRetry({
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:5px">${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `
    });
  },

  /* ---------- INTERNSHIP MATCH ---------- */
  sendInternshipMatch: async (email, emailContent) => {
    return sendWithRetry({
      to: email,
      subject: emailContent.subject,
      text: emailContent.textContent,
      html: emailContent.htmlContent
    });
  },

  /* ---------- GENERAL NOTIFICATION ---------- */
  sendGeneralNotification: async (email, subject, message, htmlMessage = null) => {
    return sendWithRetry({
      to: email,
      subject: subject,
      text: message,
      html: htmlMessage || `
        <div style="font-family: Arial; max-width:600px; margin:auto;">
          <div style="background:#667eea;color:white;padding:20px;text-align:center;">
            <h2>PM Internship Scheme</h2>
          </div>

          <div style="padding:20px;">
            <p>${message}</p>
          </div>

          <div style="background:#f9f9f9;padding:15px;text-align:center;">
            <small>Government of India Initiative</small>
          </div>
        </div>
      `
    });
  },

  /* ---------- BULK EMAIL ---------- */
  sendBulkEmails: async (emailList, subject, messageTemplate, delay = 100) => {
    const results = { sent: 0, failed: 0, errors: [] };

    for (let i = 0; i < emailList.length; i++) {
      const { email, data } = emailList[i];

      try {
        let personalizedMessage = messageTemplate;

        // Replace placeholders {{name}}, {{company}}, etc.
        if (data) {
          Object.keys(data).forEach(key => {
            personalizedMessage = personalizedMessage.replace(
              new RegExp(`{{${key}}}`, 'g'),
              data[key]
            );
          });
        }

        await sendWithRetry({
          to: email,
          subject,
          text: personalizedMessage,
          html: `
            <div style="font-family: Arial; max-width:600px; margin:auto;">
              <div style="background:#667eea;color:white;padding:20px;text-align:center;">
                <h2>PM Internship Scheme</h2>
              </div>

              <div style="padding:20px;">
                ${personalizedMessage.replace(/\n/g, '<br>')}
              </div>

              <div style="background:#f9f9f9;padding:15px;text-align:center;">
                <small>Government of India Initiative</small>
              </div>
            </div>
          `
        });

        results.sent++;

        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        console.error(`❌ Failed for ${email}`, error);
        results.failed++;
        results.errors.push({ email, error: error.message });
      }
    }

    return results;
  }
};
