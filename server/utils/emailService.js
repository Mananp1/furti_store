import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      return null;
    }
  }
};

export const sendMagicLinkEmail = async ({ email, url, token }) => {
  const transporter = createTransporter();

  if (!transporter) {
    return { success: true };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Sign in to Furni Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Furni Store!</h2>
        <p>Click the button below to sign in to your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Sign In to Furni Store
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 5 minutes. If you didn't request this email, 
          you can safely ignore it.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${url}" style="color: #007bff;">${url}</a>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
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
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  if (!transporter) {
    return { success: true };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
          <p><strong>User ID:</strong> ${userId || "Not logged in"}</p>
          <p><strong>Contact ID:</strong> ${contactId}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #495057; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 8px;">
          <p style="margin: 0; color: #6c757d; font-size: 14px;">
            This is an automated notification from your Furni Store contact form.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
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
      "💡 To enable real email sending, add EMAIL_PASSWORD to your .env file"
    );
    return { success: true };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
          <a href="${process.env.FRONTEND_URL || "http://localhost:5174"}" 
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
