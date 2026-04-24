const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // MUST BE GOOGLE APP PASSWORD
      },
    });

    await transporter.verify(); // 🔥 Important (checks server availability)

    await transporter.sendMail({
      from: `"Growth Academy Contact" <${process.env.MAIL_USER}>`,
      replyTo: email,
      to: process.env.MAIL_USER,
      subject: "📩 New Contact Form Message",
      text: `
New Contact Message:

Name: ${name}
Email: ${email}

Message:
${message}
            `,
    });

    res.json({ success: true, message: "Email sent successfully!" });

  } catch (err) {
    console.error("Mail error:", err);
    res.json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
