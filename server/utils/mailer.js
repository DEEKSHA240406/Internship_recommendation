// mailer.js - Enhanced with internship notification support
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;

async function configureTransporter() {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates (optional)
    },
  });

  await transporter
    .verify()
    .then(() => {
      console.log("SMTP connection established successfully.");
    })
    .catch((err) => {
      console.error("SMTP connection failed:", err);
      console.error("Error stack trace:", err.stack);
    });
}

configureTransporter();

module.exports = {
  // Your existing OTP function
  sendOtp: async (email, otp) => {
    const mailOptions = {
      from: '"Internship Recommendation Platform" <no-reply@yourdomain.com>',
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  },

  // NEW: Send internship match notification
  sendInternshipMatch: async (email, emailContent) => {
    const mailOptions = {
      from: '"Internship Recommendation Platform" <no-reply@yourdomain.com>',
      to: email,
      subject: emailContent.subject,
      text: emailContent.textContent,
      html: emailContent.htmlContent,
    };

    await transporter.sendMail(mailOptions);
  },

  // NEW: Send general notification
  sendGeneralNotification: async (
    email,
    subject,
    message,
    htmlMessage = null,
  ) => {
    const mailOptions = {
      from: '"Internship Recommendation Platform" <no-reply@yourdomain.com>',
      to: email,
      subject: subject,
      text: message,
      html:
        htmlMessage ||
        `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
                        <h2>Internship Recommendation</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>${message}</p>
                    </div>
                    <div style="background: #f9f9f9; padding: 15px; text-align: center;">
                        <small>Government of India Initiative</small>
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  },

  // NEW: Get transporter instance (for advanced usage)
  getTransporter: () => {
    return transporter;
  },

  // NEW: Send bulk emails (with delay to prevent spam flags)
  sendBulkEmails: async (emailList, subject, messageTemplate, delay = 100) => {
    const results = { sent: 0, failed: 0, errors: [] };

    for (let i = 0; i < emailList.length; i++) {
      const { email, data } = emailList[i];

      try {
        let personalizedMessage = messageTemplate;

        // Replace placeholders in message template
        if (data) {
          Object.keys(data).forEach((key) => {
            personalizedMessage = personalizedMessage.replace(
              new RegExp(`{{${key}}}`, "g"),
              data[key],
            );
          });
        }

        const mailOptions = {
          from: '"Internship Recommendation Platform" <no-reply@yourdomain.com>',
          to: email,
          subject: subject,
          text: personalizedMessage,
          html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
                                <h2>Internship Recommendation</h2>
                            </div>
                            <div style="padding: 20px;">
                                ${personalizedMessage.replace(/\n/g, "<br>")}
                            </div>
                            <div style="background: #f9f9f9; padding: 15px; text-align: center;">
                                <small>Government of India Initiative</small>
                            </div>
                        </div>
                    `,
        };

        await transporter.sendMail(mailOptions);
        results.sent++;

        // Add delay to prevent overwhelming SMTP server
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        results.failed++;
        results.errors.push({ email, error: error.message });
      }
    }

    return results;
  },
};
