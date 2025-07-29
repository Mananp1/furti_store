import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  if (!process.env.EMAIL_USER_GMAIL || !process.env.EMAIL_PASSWORD_GMAIL) {
    console.log("⚠️ Gmail email credentials not found, using console fallback");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER_GMAIL,
      pass: process.env.EMAIL_PASSWORD_GMAIL,
    },
  });
};

export const sendMagicLinkEmail = async ({ email, url, token }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("📧 Magic Link Email (would be sent to):", email);
    console.log("Subject: Sign in to Furni Store");
    console.log(
      "💡 To enable real email sending, add EMAIL_USER_GMAIL and EMAIL_PASSWORD_GMAIL to your .env file"
    );
    return { success: true };
  }

  const mailOptions = {
    from: `"Furni Store" <${process.env.EMAIL_USER_GMAIL}>`,
    to: email,
    subject: "Sign in to Furni Store",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 40px 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Welcome to <span style="color: #007bff;">Furnishly</span>!</h2>
  
  <p style="font-size: 16px; color: #444; text-align: center; line-height: 1.6;">
    You're just one click away from accessing your account. Tap the button below to sign in securely.
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" 
       style="background: linear-gradient(90deg, #007bff 0%, #0056b3 100%); color: #fff; padding: 14px 32px; 
              font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px; 
              box-shadow: 0 3px 8px rgba(0,123,255,0.3); transition: background 0.3s ease;">
      Sign In to Furnishly
    </a>
  </div>

  <p style="font-size: 14px; color: #666; text-align: center;">
    This link will expire in 5 minutes. If you didn't request this email, feel free to ignore it.
  </p>

  <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;">

  <p style="font-size: 13px; color: #999; word-break: break-word;">
    If the button above doesn't work, copy and paste this URL into your browser:<br>
    <a href="${url}" style="color: #007bff;">${url}</a>
  </p>

  <p style="font-size: 12px; color: #bbb; text-align: center; margin-top: 30px;">
    &copy; 2025 Furni Store. All rights reserved.
  </p>
</div>

    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Magic link email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending magic link email:", error);
    return { success: false, error: error.message };
  }
};

export const sendContactEmail = async ({
  firstName,
  lastName,
  email,
  message,
  userId,
  contactId,
}) => {
  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER_GMAIL;

  if (!transporter) {
    console.log("📧 Contact Email (would be sent to admin):", adminEmail);
    console.log("Subject: New Contact Form Submission");
    console.log(
      "💡 To enable real email sending, add EMAIL_USER_GMAIL and EMAIL_PASSWORD_GMAIL to your .env file"
    );
    return { success: true };
  }

  const mailOptions = {
    from: `"Furni Store Contact" <${process.env.EMAIL_USER_GMAIL}>`,
    to: adminEmail,
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f6f9; padding: 30px; border-radius: 10px;">
  
  <h2 style="color: #2c3e50; text-align: center; margin-bottom: 25px;">📩 New Contact Form Submission</h2>
  
  <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></p>
    <p style="margin: 8px 0;"><strong>User ID:</strong> ${
      userId || "Not logged in"
    }</p>
    <p style="margin: 8px 0;"><strong>Contact ID:</strong> ${contactId}</p>
    <p style="margin: 8px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
  </div>

  <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e1e5ea; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
    <h3 style="color: #007bff; margin-top: 0;">Message</h3>
    <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
  </div>

  <div style="margin-top: 30px; padding: 15px; background-color: #f0f3f6; border-radius: 6px; text-align: center;">
    <p style="margin: 0; color: #6c757d; font-size: 14px;">
      This is an automated notification from your <strong>Furni Store</strong> contact form.
    </p>
  </div>
</div>

    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Contact notification email sent to admin:", adminEmail);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending contact notification email:", error);
    return { success: false, error: error.message };
  }
};

export const sendAutoReplyEmail = async ({ firstName, lastName, email }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("📧 Auto-Reply Email (would be sent to):", email);
    console.log("Subject: Thank you for contacting Furni Store");
    console.log(
      "💡 To enable real email sending, add EMAIL_USER_GMAIL and EMAIL_PASSWORD_GMAIL to your .env file"
    );
    return { success: true };
  }

  const mailOptions = {
    from: `"Furni Store Support" <${process.env.EMAIL_USER_GMAIL}>`,
    to: email,
    subject: "Thank you for contacting Furni Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for reaching out!</h2>
        
        <p>Dear ${firstName} ${lastName},</p>
        
        <p>Thank you for contacting Furni Store. We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">What happens next?</h3>
          <ul style="color: #495057;">
            <li>Our team will review your message within 24 hours</li>
            <li>We'll respond to your inquiry with a detailed reply</li>
            <li>If you have any urgent questions, please call our support line</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li>Browse our latest furniture collection</li>
          <li>Check out our FAQ section for quick answers</li>
          <li>Follow us on social media for updates</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Visit Furni Store
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #6c757d; font-size: 14px;">
          Best regards,<br>
          The Furni Store Team
        </p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 8px;">
          <p style="margin: 0; color: #6c757d; font-size: 12px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Auto-reply email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending auto-reply email:", error);
    return { success: false, error: error.message };
  }
};
