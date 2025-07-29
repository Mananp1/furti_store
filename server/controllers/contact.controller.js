import { Contact } from "../models/contact.model.js";
import { sendContactEmail, sendAutoReplyEmail } from "../utils/emailService.js";


export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    const userId = req.user?.authUserId || null;




    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please fill in all required fields",
      });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        message: "Please enter a valid email address",
      });
    }


    const contact = new Contact({
      firstName,
      lastName,
      email,
      message,
      userId,
    });

    await contact.save();


    try {
      await sendContactEmail({
        firstName,
        lastName,
        email,
        message,
        userId,
        contactId: contact._id,
      });

    } catch (emailError) {
      console.error("❌ Failed to send admin email:", emailError);

    }


    try {
      await sendAutoReplyEmail({
        firstName,
        lastName,
        email,
      });

    } catch (autoReplyError) {
      console.error("❌ Failed to send auto-reply:", autoReplyError);

    }

    res.status(201).json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("❌ Contact form submission error:", error);
    res.status(500).json({
      error: "Failed to submit contact form",
      message: "Please try again later",
    });
  }
};


export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(contacts);
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({
      error: "Failed to fetch contacts",
      message: "Please try again later",
    });
  }
};


export const updateContactStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { status } = req.body;

    if (!["pending", "replied", "resolved"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        message: "Status must be pending, replied, or resolved",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found",
        message: "Contact submission not found",
      });
    }

    res.json(contact);
  } catch (error) {
    console.error("❌ Error updating contact status:", error);
    res.status(500).json({
      error: "Failed to update contact status",
      message: "Please try again later",
    });
  }
};
