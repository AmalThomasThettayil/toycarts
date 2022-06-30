const express = require("express");
const router = express.Router();
const adminHelpers = require("../helpers/adminHelpers");
const user = require("../models/user");
const Product = require("../models/product");
const async = require("hbs/lib/async");
const { response } = require("express");
const Storage = require("../middleware/multer");

router.get("/", function (req, res, next) {
  res.render("admin/adminLogin", { layout: false });
});

router.post("/adminLogin", function (req, res, next) {
  res.redirect("/admin/adminDash",{ layout: false, adminvalue });
});

router.get("/adminDash", function (req, res, next) {
  let adminvalue = req.session.admin;
  res.render("admin/adminDash", { layout: false, adminvalue });
});

router.get("/productManage", async function (req, res, next) {
  console.log("productsssssssss");
  const products = await adminHelpers.getAllProducts();
  console.log(products);
  // const alert=req.flash('msg')
  res.render("admin/productManage", { products, layout: false });
});

router.get("/userManage", function (req, res, next) {
  adminHelpers.getAllUsers().then((user) => {
    res.render("admin/userManage", { layout: false, user });
  });
});

router.get("/addbrands", async (req, res) => {
  const categories = await adminHelpers.getAllCategory();
  console.log(categories);
  res.render("admin/addbrands", {
    categories,
    layout: false,
    Err: req.session.loggE,
    Errc: req.session.loggC,
  });
  req.session.loggE = null;
  req.session.loggC = null;
});
router.post("/addBrands", (req, res) => {
  console.log(req.body);
  console.log("hfdajshfjhasg");
  adminHelpers
    .addBrand(req.body)
    .then((response) => {
      res.redirect("/admin/addbrands");
    })
    .catch((err) => {
      req.session.loggE = err.msg;
      console.log(req.session.loggE);
      res.redirect("/admin/addbrands");
    });
});

router.post("/addCategory", (req, res) => {
  console.log(req.body);
  console.log("category log");
  adminHelpers
    .addCategory(req.body)
    .then((response) => {
      res.redirect("/admin/addBrands");
    })
    .catch((err) => {
      req.session.loggC = err.msg;
      console.log(req.session.loggC);
      res.redirect("/admin/addbrands");
    });
});

router.post("/addSubcategory", (req, res) => {
  console.log(req.body);
  console.log("subcategory log");
  adminHelpers
    .addSubcategory(req.body)
    .then((response) => {
      res.redirect("/admin/addBrands");
    })
    .catch((err) => {
      req.session.loggSc = err.msg;
      console.log(req.session.loggSc);
      res.redirect("/admin/addbrands");
    });
});

router.delete("/User/:id", function (req, res, next) {
  const userId = req.params.id;
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect("/admin/adminDash");
  });
});

router.get("/addProducts", async (req, res) => {
  const category = await adminHelpers.getAllCategory();
  const brandName = await adminHelpers.getBrands();
  const subcategory = await adminHelpers.getAllSubcategory();
  console.log(brandName);
  res.render("admin/addProduct", {
    category,
    subcategory,
    brandName,
    admin: true,
    layout: false,
  });
});

router.post(
  "/addProducts",
  Storage.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  function (req, res, next) {
    console.log("post add products");
    let img1 = req.files.image1[0].filename;
    let img2 = req.files.image2[0].filename;
    let img3 = req.files.image3[0].filename;
    let img4 = req.files.image4[0].filename;
    console.log(req.body);
    adminHelpers
      .addProduct(req.body, img1, img2, img3, img4)
      .then((response) => {
        res.redirect("/admin/productManage");
        console.log(response);
      });
  }
);
router.get("/deleteProduct/:id", (req, res) => {
  console.log(req.params.id+'inside deleteeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  const proId = req.params.id;
  adminHelpers.deleteProduct(proId).then((response) => {
    req.session.removedProduct = response;
    res.redirect("/admin/productManage");
  });
  console.log(proId);
});
router.get("/editProduct/:id", async (req, res) => {
  let product = await adminHelpers.getProductDetails(req.params.id);
  console.log(product+'111111111111111111111111111111');
  const category = await adminHelpers.getAllCategory();
  const brandName = await adminHelpers.getBrands();
  const subcategory = await adminHelpers.getAllSubcategory();
  console.log("got all details");
  console.log(product.productName);
  res.render("admin/editProduct", {
    subcategory,
    category,
    brandName,
    product,
    admin: true,
    layout: false,
  });
});
router.post("/editProduct/:id",
  Storage.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  function (req, res) {
    const proId = req.params.id;
     const img1 = req.files.image1
      ? req.files.image1[0].filename
      : req.body.image1;
    const img2 = req.files.image2
      ? req.files.image2[0].filename
      : req.body.image2;
    const img3 = req.files.image3
      ? req.files.image3[0].filename
      : req.body.image3;
    const img4 = req.files.image4
      ? req.files.image4[0].filename
      : req.body.image4;
          console.log(img1, img2, img3, img4);
    adminHelpers.updateProduct(req.body, proId, img1, img2, img3, img4)
      .then((response) => {
        console.log(response);
        res.redirect("/admin/productManage");
      });
  }
);

router.get("/blockUser/:id", (req, res) => {
  const proId = req.params.id; 
  console.log(proId);
  console.log("sdjfhusguasuashguahshasdgs");
  adminHelpers.blockUser(proId).then((response) => {
    res.json({status:true})
    });
});
router.get("/unBlockUser/:id", (req, res) => {
  const proId = req.params.id;
  console.log("esfhusayfuahiuashahsfhasdu");
  adminHelpers.unBlockUser(proId).then((response) => {  
  });
});

router.get('/orders',(req,res)=>{
  adminHelpers.allOrders().then((response)=>{
    const allOrders=response
    res.render('admin/orders',{allOrders,layout:false})
    
  })
})


router.get('/orderDetails/:id',(req,res)=>{
  adminHelpers.orderDetails(req.params.id).then((response)=>{
    const order=response
    res.render('admin/orderDetails',{order,admin:true,layout:false})
    
  })
})
router.post('/changeProductType',(req,res)=>{
  console.log('inside change')
  adminHelpers.changeProductType(req.body).then((response)=>{
    res.redirect('/admin/productManage')
  })
})
router.post('/changeCarosel',(req,res)=>{
  console.log('inside change carosel')
  adminHelpers.changeCarosel(req.body).then((response)=>{
    res.redirect('/admin/productManage')
  })
})


module.exports = router;
