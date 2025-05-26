import nodemailer from "nodemailer";

const sendEmail = async (req, res) => {
  const { name, email, message } = req.body; // 'message' instead of 'password'

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: email, // Sender's email (user input)
      to: process.env.EMAIL_USER, // Your email
      subject: `Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Include message
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

export default sendEmail;
