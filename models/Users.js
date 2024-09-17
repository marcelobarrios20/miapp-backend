const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Relación con el carrito
    role: { type: String, default: 'user' }
});

// Encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
