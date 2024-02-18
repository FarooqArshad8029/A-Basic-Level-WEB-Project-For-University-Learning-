const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
// mongoose.connect("mongodb://localhost:27017/E-com",{
  mongoose.connect("mongodb://0.0.0.0:27017/E-com",{

  useNewUrlParser:true,
  useUnifiedTopology:true 
})
.then(()=>{
console.log("Db connection Successfully established");
})
.catch((e)=>{
  console.log(e);

})

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require:true
  },
  description: {
    type: String,
    require:true

  },
  price: {                                                                            
    type: Number,
    require:true

  },
  image: {
    type: String,
  },
  createdDate: {
    type: Date,
  },
  category: {
    type: String,
    require:true
  },
  stock: {
    type: Number,
    require:true
  }
});

const product =  mongoose.model("product", productSchema);

module.exports = product;
