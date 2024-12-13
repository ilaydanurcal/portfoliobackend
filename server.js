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

// Nodemailer Transporter Ayarları - Port 587 ve TLS Kullanımı
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // SMTP sunucu adresi
  port: 587, // TLS portu
  secure: false, // TLS kullanımı için false
  auth: {
    user: process.env.EMAIL_USER, // .env dosyasındaki Gmail adresiniz
    pass: process.env.EMAIL_PASS, // .env dosyasındaki uygulama şifreniz
  },
  tls: {
    rejectUnauthorized: false, // Güvenlik ayarları
  },
});

// Transporter'ı doğrulama
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
    return res.status(400).json({ msg: "Lütfen tüm alanları doldurun." });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Yeni mesaj: ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error " + err);
      return res
        .status(500)
        .json({ msg: "Mesaj gönderilirken bir hata oluştu." });
    }
    return res.status(200).json({ msg: "Mesajınız başarıyla gönderildi!" });
  });
});

// Server'ı Başlatma
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
