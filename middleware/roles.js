const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
    }
    next();
  };
  
  const userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Acceso denegado. Solo usuarios pueden agregar productos al carrito.' });
    }
    next();
  };
  
  module.exports = {
    adminMiddleware,
    userMiddleware
  };
  