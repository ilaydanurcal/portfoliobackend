// server.js

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer Transporter Ayarları
const transporter = nodemailer.createTransport({
  service: "gmail", // Kullanacağınız e-posta servis sağlayıcısı
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test için transporter'ı doğrulama
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Form gönderimini işleme
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  // Basit doğrulama
  if (!name || !email || !message) {
    return res.status(400).json({ msg: "Please fill in all fields." });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error " + err);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
    return res.status(200).json({ msg: "Message Sent!" });
  });
});

// Server'ı Başlatma
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
