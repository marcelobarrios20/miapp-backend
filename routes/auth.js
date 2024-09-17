const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Ruta para login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret_key", {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

const passport = require("passport");

// Ruta para obtener el usuario actual
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
);

module.exports = router;
