const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Asegúrate de tener un modelo de Product
const { adminMiddleware } = require('../middlewares/roles'); // Middleware para rol admin

// Ruta para obtener todos los productos (disponible para cualquier usuario)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo los productos', error });
  }
});

// Ruta para obtener un producto por ID (disponible para cualquier usuario)
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo el producto', error });
  }
});

// Ruta para crear un nuevo producto (solo accesible por administradores)
router.post('/products', adminMiddleware, async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const newProduct = new Product({ name, description, price, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creando el producto', error });
  }
});

// Ruta para actualizar un producto (solo accesible por administradores)
router.put('/products/:id', adminMiddleware, async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name, description, price, stock
    }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando el producto', error });
  }
});

// Ruta para eliminar un producto (solo accesible por administradores)
router.delete('/products/:id', adminMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el producto', error });
  }
});

module.exports = router;
