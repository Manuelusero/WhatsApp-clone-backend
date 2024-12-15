import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
//Importar el user.repository

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
     if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
        const newUser = new User({
           name,
           email,
           password: hashedPassword,
           verificationToken,
           isVerified: false
          });

        await newUser.save();

        await sendVerificationEmail(email, verificationToken);


    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: "Error interno del servidor."});
  }
};

export const verifyUser = async (req, res) => {
  console.log("Token recibido:", req.params.token);
  const { token } = req.params;


  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Token de verificación inválido o expirado.' });
    }

    user.isVerified = true;
    user.verificationToken = null; 
    await user.save(); 

    console.log("Cuenta verificada correctamente. Redirigiendo al login...");

    res.redirect('https://whatsapp-clone-frontend-lilac.vercel.app/login');
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ message: 'Error al verificar el usuario', error });
  }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });
    console.log('Usuario encontrado:', user);
    if (!user) {
      return res.status(400).json({ message: "Credenciales mal" });
    }
    
    
    if (!user.isVerified) {
      return res.status(403).json({ message: "Cuenta no verificada. Por favor, verifica tu correo." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Credenciales feas" });
    }

    // // Validar contraseña

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid)  {
    //   return res.status(400).json({ message: "Credenciales inválidas" });
    // }

    // Generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      token,
       user:{ id:user._id,
       name: user.name,
       email: user.email } });
  } 
  catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};



// Recuperar contraseña
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "El correo no está registrado." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; 
    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: "Correo de recuperación enviado." });
  } catch (error) {
    console.error("Error al enviar correo de recuperación:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada con éxito." });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Función para enviar correos electrónicos
export const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verificación de cuenta - CloneWhatsapp",
    html: `
      <h2>¡Bienvenido a CloneWhatsapp!</h2>
      <p>Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="https://whatsapp-clone-frontend-lilac.vercel.app/verify/${verificationToken}">Verificar cuenta</a>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// Enviar correo para restablecer contraseña
const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperación de contraseña",
    html: `<p>Restablece tu contraseña haciendo clic en este enlace:</p>
           <a href="https://whatsapp-clone-frontend-lilac.vercel.app/reset-password/${token}">Restablecer contraseña</a>`,
  };

  await transporter.sendMail(mailOptions);
};