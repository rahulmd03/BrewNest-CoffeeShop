var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')


/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    console.log(products)
    res.render('admin/view-products', { admin: true, products })

  })
});
router.get('/add-product', function (req, res) {
  res.render('admin/add-product', { admin: true })
})
router.post('/add-product', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {
    if (!id) {
      return res.send("Error adding product");
    }

    if (req.files && req.files.Image) {
      let image = req.files.Image;
      image.mv('./public/product-images/' + id + '.jpg', (err) => {
        if (err) {
          console.log("Image upload failed:", err);
        } else {
          console.log("Image uploaded successfully");
        }
        res.render('admin/add-product');
      });
    } else {
      console.log("No image uploaded");
      res.render('admin/add-product');
    }
  });
});
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{admin: true,product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files && req.files.Image){
       let image=req.files.Image
       image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

router.get('/orders', async (req, res) => {
  const orders = await productHelpers.getAllOrders(); 
  res.render('admin/view-orders', { admin: true, orders });
});


module.exports = router;
