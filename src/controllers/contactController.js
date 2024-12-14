import Contact from '../models/Contact.js';
import fs from 'fs';

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    
    let imageBase64 = '';
    if (req.file) {
      const filePath = req.file.path;
      imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
     
      fs.unlinkSync(filePath);
    }
  
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        image: imageBase64, 
        userId: req.user.id,
      });
  
      await newContact.save();

      const contacts = await Contact.find({ userId: req.user.id });
      res.status(201).json({
        message: 'Contacto creado correctamente',
        contacts,
      });
    }catch (error) {
      console.error('Error al crear contacto:', error);
      res.status(500).json({ message: 'Error al crear el contacto.' });
    }
  };

  export const getContacts = async (req, res) => {
    try {
     
      const contacts = await Contact.find({ userId: req.user.id });
  
      if (!contacts || contacts.length === 0) {
        return res.status(404).json({ message: 'No se encontraron contactos' });
      }
  
 
      const formattedContacts = contacts.map((contact) => ({
        id: contact._id, 
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        thumbnail: contact.image, 
      }));

      res.status(200).json(formattedContacts);
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      res.status(500).json({ message: 'Error al obtener los contactos' });
    }
  };
  