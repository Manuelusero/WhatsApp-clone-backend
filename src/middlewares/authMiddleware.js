import jwt from 'jsonwebtoken';

export const authMiddleware = (roles_permitidos = []) => {
  return (req, res, next) => {
    try {
      // Obtener el token desde el encabezado de autorización
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ 
          ok: false,
          message: 'Acceso denegado. No se proporcionó un token.',
          detail: 'Se esperaba un encabezado de autorización con formato Bearer token.'
        });
      }

      // Extraer el token del encabezado
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ 
          ok: false,
          message: 'Token malformado.',
          detail: 'El encabezado de autorización debe incluir un token después de "Bearer".'
        });
      }

      // Verificar el token usando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adjuntar la información del usuario al objeto `req`
      req.user = decoded;

      // Validar roles si se especificaron
      if(roles_permitidos.length &&  !roles_permitidos.includes(req.user.role)){
        return res.status(403).json({
          ok: false,
          message: 'Acceso restringido.',
          detail: 'No tienes los permisos necesarios para realizar esta operación.'
        });
      }

      // Pasar al siguiente middleware o controlador
      next();
    } catch (error) {
      // Manejo de errores relacionados con el token
      return res.status(401).json({
        ok: false,
        message: 'Fallo en la autenticación.',
        detail: error.message
      });
    }
  };
};
