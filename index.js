const http = require("http")
var url = require('url');
const fs = require("fs") ; 
const path = require("path");
const partials = require("partials");
const express = require("express");
const app = express();
const multer = require('multer') ;
app.set('view engine', 'ejs');
const mongoose = require("mongoose");
const productModel = require("./model/productModel");
const userModel = require("./model/userModel");
const imgModel = require("./model/picModel");
const{MongoClient} =require('mongodb');
const port =process.env.PORT || 4000;
const publicPath = path.join(__dirname,"./public")
app.use(express.static(publicPath))
const viewsPath = path.join(__dirname,"./views")
app.set('views', viewsPath);
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
var cookieParser = require('cookie-parser');
		app.use(cookieParser());

var formidable = require('formidable');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
});

// this code will handle file types like jpeg, jpg, and png
// const fileFilter=(req, file, cb)=>{
//  if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
//      cb(null,true);
//  }else{
//      cb(null, false);
//  }
// }

var upload = multer({ 
  storage:storage
}).single('file');



   // saving new Product data in db upload.single('image')
   app.post('/form/added/',upload, async (req , res ) => {
   
    try{
     
    var imageDetails = new imgModel({
      name : req.file.filename
    })
    console.log("imageDetails:",imageDetails)

    let imgResult = await imageDetails.save();
    console.log("imgResult:",imgResult)

    
//       var form = new formidable.IncomingForm();

//    var fff =   form.parse(req, function (err, fields, files) {
//         var oldpath = files.filetoupload.filepath;
// console.log("oldpath:",oldpath);

//         var newpath = '/public/uploads' + files.filetoupload.originalFilename;
// console.log("newpath:",newpath);

//         const check =  fs.rename(oldpath, newpath, function (err) {
//         });
// console.log("check:",check);

//       });
//       console.log("fff:",fff);


      let data = new productModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:imageDetails.name,
        createdDate: Date(),
        category:req.body.Category,
        stock:req.body.Stock
      })
      let result = await data.save();
      res.status(201).render('newProduct'); 
    }
    catch(err){
      console.log("Add New Product Error:",err);
    }
      });
// render home page
app.get("/", async (req, res) => {

  let data = await  productModel.find();
  console.log("Cookies :  ", req.cookies);  

  // console.log("data:",data);

  res.render('home',{data});
});
// render sinUp page
app.get("/signUp",  (req, res) => {
  res.render('signUp',{});
});

// save  signUp Data 
app.post("/signUpUser", async   (req, res) => {
  try{

    console.log("req.body:",req.body)
  let user = await  userModel.find({email:req.body.email,phone:req.body.phone});
  if(user.length  > 0) 
{
  res.send("User Already exist");
}
else{
  let data = new userModel({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    phone:req.body.phone,
    password: req.body.password
  })
  let result = await data.save();
  res.status(201).render('signIn'); 
}
 }
  catch(err){
    console.log("signUp User Error:",err);
  }});


// render signIn page
app.get("/signIn",  (req, res) => {
  res.render('signIn',{});
});

app.post("/user", async (req, res) => {
  console.log("req.body:",req.body)
  let user = await  userModel.find({email:req.body.email,password:req.body.password});
console.log(user);
  if(user.length  > 0) 
{
  console.log("if check")
  let data = await  productModel.find();

    res.render('home',{data});

}else{
  res.send("User Not Exit Plz Sign Up!")
}
})





// render cart page
app.get("/cart/:_id",  async (req, res) => {
  let product = await  productModel.findById(req.params._id);
  console.log(product);

  res.render('cart',{product});
});


  // showing all products in db on products page
  app.get("/products", async (req, res) => {
    let data = await  productModel.find();
    res.render('products',{data});
  });
// showing single  product details in seprate page 
  app.get('/productDetail/:_id', async (req , res) => {
    let data = await  productModel.findById(req.params._id);
    res.render('productDetail',{data});
  });
  // render new product adding form page
  app.get("/newProduct", (req, res) => {
  

     res.render("newProduct");
  }); 
  
// render the frorm for updaing a single product details
  app.get("/editProduct/:_id", async (req, res) => {
    const {_id} = req.params;
    let data = await  productModel.find({_id});
    // console.log("dataEdirProductPage:",data)
    res.render("editProduct",{data});
  
  });

  app.get("/mainProduct", async (req, res) => {
    let data = await  productModel.find({});
    res.render("edit",{data});
  
  });
// saving updated data in db
  app.post("/updated/:_id", upload,async (req, res) => {
    console.log("Updated Req.body:",req.body)
    console.log(" Req.params._id:",req.params._id)
    // var imageDetails = new imgModel({
    //   name : req.file.filename
    // })
    // console.log("imageDetails:",imageDetails)
    // let imgResult = await imageDetails.save();

    // console.log("imgResult:",imgResult)
    let id = req.params._id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Yes, it's a valid ObjectId, proceed with `findById` call.
      await  productModel.findByIdAndUpdate( req.params._id ,
        {
        name       : req.body.name,
        description: req.body.description,
        price      : req.body.price,
        category   : req.body.category,
        stock      : req.body.stock,
              }
           ,  async (err, result) => {
              if (err) {
              console.log("err1:",err);
            } else {  
            console.log("Product Updated successfully");
    let data = await  productModel.find({});

            res.render('edit',{data});
          }
       }).clone().catch(function(err){ console.log("err2:",err)})
    }
    else{
      console.log("Not Valid ID");

    }
  });

// delete specific product from page and db
  app.get('/delete/:_id', async (req,res)=>{
    const {_id} = req.params;
    let deletedData = await  productModel.deleteOne({_id})
    .then(async ()=>{
    
        console.log("Task deleted successfully")
    let data = await  productModel.find({});

        res.render('edit',{data})
    })
    .catch((err)=>{
        console.log("Product Deleted Eror:",err);
    })
    })


  // show search by category product 
  app.post('/searchItem',async (req,res)=>{
    let data = await  productModel.find({category:req.body.category});
    console.log("searchData:",data)
if(data.length > 0){
  res.render('searchProduct',{data})

}else{
  res.send("Sorry ! No Such Data Found")
}

  })



  app.listen(port, () => {
    console.log(`Server Listening at PORT ${port}`);
  });

