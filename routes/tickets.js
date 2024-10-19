const Ticket = require("../models/Ticket");
const Product = require("../models/Product"); // Asumiendo que tienes un modelo de productos

// Función para generar un código de ticket único
const generateTicketCode = () => {
  return "TICKET-" + Date.now(); // Puedes mejorar esta lógica para hacerla más robusta
};

// Función para calcular el monto total de la compra
const calculateTotalAmount = (cart) => {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

exports.finalizePurchase = async (req, res) => {
  const { cart, user } = req.body; // Asumimos que el carrito y el usuario están en el body de la solicitud

  try {
    let purchaseSuccess = true;
    const unavailableProducts = [];

    // Verificar el stock de cada producto en el carrito
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product.stock < item.quantity) {
        unavailableProducts.push(item);
        purchaseSuccess = false;
      }
    }

    // Si no hay stock suficiente en algún producto, responder con los productos no disponibles
    if (!purchaseSuccess) {
      return res.status(400).json({
        message:
          "Compra incompleta, algunos productos no tienen stock suficiente",
        unavailableProducts,
      });
    }

    // Si todo está bien, restar el stock de cada producto y generar el ticket
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Generar el ticket una vez confirmada la compra
    const newTicket = new Ticket({
      code: generateTicketCode(),
      amount: calculateTotalAmount(cart),
      purchaser: user.email, // O req.user.email si estás autenticando usuarios
    });

    await newTicket.save();

    res.status(200).json({
      message: "Compra completada con éxito",
      ticket: newTicket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al finalizar la compra" });
  }
};
