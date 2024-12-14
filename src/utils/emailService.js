import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  
  service: "gmail", // Cambia el servicio si usas otro proveedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: false,
});
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

export const sendEmail = async (email, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado a:", email);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
