import Contact from '../models/Contact.js';
import fs from 'fs';

export const createContact = async (req, res) => {
  console.log('Datos recibidos:', req.body);
console.log('Archivo recibido:', req.file);

    const { name, email, phone } = req.body;
    const userId = req.user.id;
    
    let imageBase64 = '';
    if (req.file) {
      const filePath = req.file.path;
      try{
      imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return res.status(500).json({ message: 'Error al leer el archivo' });
    }
  }
  
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        thumbnail: imageBase64, 
        image: imageBase64,
        userId,
      });
  
      await newContact.save();

      const contacts = await Contact.find({ userId: req.user.id });
      const formattedContacts = contacts.map((contact) => ({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        thumbnail: contact.thumbnail,
      }));
      res.status(201).json({message:"Contacto creado con exito",contacts:formattedContacts});
     
    }catch (error) {
      console.error('Error al crear contacto:', error);
      res.status(500).json({ message: 'Error al crear el contacto.' });
    }
  };

  export const getContacts = async (req, res) => {
    const userId = req.user.id;
    try {
     
      const contacts = await Contact.find({ userId});
      const formattedContacts = contacts.map((contact) => ({
        id: contact._id, 
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        thumbnail: contact.thumbnail, 
      }));

     
      res.status(200).json({contacts:formattedContacts});
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      res.status(500).json({ message: 'Error al obtener los contactos' });
    }
  };

  export const getContact = async (req, res) => {
    try {
      const { contactId } = req.params;
      console.log("contactId recibido en backend:", contactId);
  
      const contact = await Contact.findById(contactId);
      if (!contact) {
        return res.status(404).json({
          ok: false,
          message: "Contacto no encontrado",
        });
      }
  
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Error al obtener el contacto",
        detail: error.message,
      });
    }
  };
  