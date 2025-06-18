const db = require('../config/connection');
var collection = require('../config/collections')
const objectId = require('mongodb').ObjectId

module.exports = {
  addToCart: (productId, sessionId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ sessionId: sessionId });

      if (cart) {
        let itemIndex = cart.products.findIndex(p => p.item == productId);
        if (itemIndex !== -1) {
          cart.products[itemIndex].quantity += 1;
        } else {
          cart.products.push({ item: productId, quantity: 1 });
        }
        db.get().collection(collection.CART_COLLECTION).updateOne({ sessionId: sessionId }, {
          $set: { products: cart.products }
        }).then(resolve);
      } else {
        db.get().collection(collection.CART_COLLECTION).insertOne({
          sessionId: sessionId,
          products: [{ item: productId, quantity: 1 }]
        }).then(resolve);
      }
    });
  },
  getCartProducts: async (sessionId) => {
    let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ sessionId: sessionId }) || { products: [] };

    let cartItems = [];
    for (let p of cart.products) {
      let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new objectId(p.item) });
      cartItems.push({ productId: p.item, product: product, quantity: p.quantity });
    }

    return cartItems;
  },
  getCartCount: async (sessionId) => {
    const cart = await db.get().collection(collection.CART_COLLECTION).findOne({ sessionId });
    let count = 0;
    if (cart && cart.products) {
      cart.products.forEach(p => count += p.quantity);
    }
    return count;
  },
  changeProductQuantity: (details, sessionId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ sessionId: sessionId });
      if (!cart || !cart.products) return reject("Cart not found");

      let itemIndex = cart.products.findIndex(p => p.item == details.productId);

      if (itemIndex !== -1) {
        if (details.count == -1 && cart.products[itemIndex].quantity == 1) {
          cart.products.splice(itemIndex, 1);
        } else {
          cart.products[itemIndex].quantity += parseInt(details.count);
        }

        await db.get().collection(collection.CART_COLLECTION).updateOne(
          { sessionId: sessionId },
          { $set: { products: cart.products } }
        );

        resolve({ status: true });
      } else {
        reject("Product not found in cart");
      }
    });
  },
  getTotalAmount: async (sessionId) => {
    const cart = await db.get().collection(collection.CART_COLLECTION).findOne({ sessionId }) || { products: [] };
    let total = 0;

    for (let p of cart.products) {
      let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new objectId(p.item) });
      if (product) {
        total += product.Price * p.quantity;
      }
    }

    return total;
  },
  placeOrder: async (orderData) => {
    return await db.get().collection(collection.ORDER_COLLECTION).insertOne(orderData);
  },

  clearCart: async (sessionId) => {
    return await db.get().collection(collection.CART_COLLECTION).deleteOne({ sessionId });
  },
  saveContactMessage: async (contactData) => {
    try {
      await db.get().collection(collection.CONTACT_COLLECTION).insertOne(contactData)
      return { status: true }
    } catch (err) {
      console.error("Error saving contact message:", err)
      return { status: false, error: err }
    }
  }


}