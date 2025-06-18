const db = require('../config/connection');
var collection = require('../config/collections');
var objectId = require('mongodb').ObjectId



module.exports = {
    addProduct: (product, callback) => {
        const database = db.get();
        if (!database) {
            console.log('DB not connected yet!');
            return callback(false);
        }

        database.collection('product').insertOne(product).then((data) => {
            console.log(data)
            callback(data.insertedId);
        }).catch((err) => {
            console.error('Insert failed:', err);
            callback(false);
        });
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: new objectId(prodId) }).then((response) => {
                //console.log(response)
                resolve(response)
            }).catch((err) => {
                console.error('Deletion failed:', err);
                reject(err);
            });
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: new objectId(proId) }, {
                $set: {
                    Name: proDetails.Name,
                    Description: proDetails.Description,
                    Price: proDetails.Price,
                    Category: proDetails.Category
                }

            }).then((response) => {
                resolve()
            })
        })
    },
    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray();
                resolve(orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                reject(err);
            }
        });
    }

}