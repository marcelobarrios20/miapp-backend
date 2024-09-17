const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/miapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('Conectado a MongoDB'));

// Rutas de autenticación
app.use('/api/sessions', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
