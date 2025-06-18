var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')


/* GET home page. */
router.get('/',async function(req, res, next) {
  const products = await productHelpers.getAllProducts();
  const cartCount = await userHelpers.getCartCount(req.sessionID);
  res.render('user/view-products', { products, cartCount });
  
});
router.get('/cart', async (req, res) => {
  cartItems = await userHelpers.getCartProducts(req.sessionID);
  total = await userHelpers.getTotalAmount(req.sessionID);
  console.log("Cart Items:", cartItems);
  res.render('user/cart', { products: cartItems, total });
});

router.get('/add-to-cart/:id', (req, res) => {
  userHelpers.addToCart(req.params.id, req.sessionID).then(() => {
    userHelpers.getCartCount(req.sessionID).then((count) => {
      res.json({ status: true, cartCount: count });
  });
});
});
router.post('/change-product-quantity', (req, res) => {
  userHelpers.changeProductQuantity(req.body, req.sessionID).then((response) => {
    res.json(response)
  })
  .catch((err) => {
      console.error("Change Quantity Error:", err);
      res.status(500).json({ status: false, error: "Internal Server Error" });
    });
}) 

router.get('/place-order',async (req,res)=>{
  const total = await userHelpers.getTotalAmount(req.sessionID);
  res.render('user/place-order',{total})
})  

//order

router.post('/place-order', async (req, res) => {
  try {
    const products = await userHelpers.getCartProducts(req.sessionID)
    const total = await userHelpers.getTotalAmount(req.sessionID)
    const orderData = {
      sessionId: req.sessionID,
      deliveryDetails: req.body,
      products: products,
      totalAmount: total,
      status: req.body['payment-method'] === 'COD' ? 'Placed' : 'Pending',
      paymentMethod: req.body['payment-method'],
      date: new Date()
    }

    await userHelpers.placeOrder(orderData)
    await userHelpers.clearCart(req.sessionID)

    res.redirect('/order-success')
  } catch (error) {
    console.error("Order Placement Error:", error)
    res.status(500).send("Something went wrong!")
  }
})

router.get('/order-success', (req, res) => {
  res.render('user/order-success')
})

//contact
router.post('/contact', async (req, res) => {
  const contactData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    date: new Date()
  };

  const result = await userHelpers.saveContactMessage(contactData);
  if (result.status) {
    res.redirect('/#contact');  
  } else {
    res.status(500).send("Failed to save contact message.");
  }
});



module.exports = router;
