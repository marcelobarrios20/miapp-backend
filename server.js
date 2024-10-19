require('dotenv').config();  // Cargar las variables de entorno

const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');

// ... resto del código



// Importar las rutas
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart'); // Rutas para el carrito de compras y compras
const productRoutes = require('./routes/products'); // Rutas para la gestión de productos

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/miapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error conectando a la base de datos:', err));

// Rutas de autenticación
app.use('/api/sessions', authRoutes);

// Montar las rutas del carrito de compras y productos
app.use('/api', cartRoutes);   // Carrito y compras
app.use('/api', productRoutes); // Gestión de productos

// Manejo de errores genérico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
