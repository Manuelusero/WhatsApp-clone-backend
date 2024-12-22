import jwt from 'jsonwebtoken';

export const authMiddleware = (roles_permitidos = []) => {
  return (req, res, next) => {
    try {
  
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ 
          ok: false,
          message: 'Acceso denegado. No se proporcionó un token.',
          detail: 'Se esperaba un encabezado de autorización con formato Bearer token.'
        });
      }

 
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ 
          ok: false,
          message: 'Token malformado.',
          detail: 'El encabezado de autorización debe incluir un token después de "Bearer".'
        });
      }

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      console.log('Datos del usuario autenticado:', req.user);
      
      if(roles_permitidos.length &&  !roles_permitidos.includes(req.user.role)){
        return res.status(403).json({
          ok: false,
          message: 'Acceso restringido.',
          detail: 'No tienes los permisos necesarios para realizar esta operación.'
        });
      }

      next();
    } catch (error) {
  
      return res.status(401).json({
        ok: false,
        message: 'Fallo en la autenticación.',
        detail: error.message
      });
    }
  };
};
