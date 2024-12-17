import Contact from '../models/Contact.js';
import fs from 'fs';

export const createContact = async (req, res) => {
  console.log('Datos recibidos:', req.body);
console.log('Archivo recibido:', req.file);

    const { name, email, phone,image, } = req.body;
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
      res.status(201).json(contacts);
    }catch (error) {
      console.error('Error al crear contacto:', error);
      res.status(500).json({ message: 'Error al crear el contacto.' });
    }
  };

  export const getContacts = async (req, res) => {
    const userId = req.user.id;
    try {
     
      const contacts = await Contact.find({ userId});
  
      if (!contacts || contacts.length === 0) {
        return res.status(404).json({ message: 'No se encontraron contactos' });
      }
  
 
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
  