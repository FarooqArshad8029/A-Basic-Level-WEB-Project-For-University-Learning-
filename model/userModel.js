const mongoose = require("mongoose");
mongoose.set('strictQuery', false)


const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    require:true
  },
   lastName : {
    type: String,
    require:true

  },
  email: {                                                                            
    type: String,
    require:true

  },
  phone: {
    type: Number,
    require:true

  },
  password: {
    type: String,
    require:true

  }
});

const user =  mongoose.model("user", userSchema);

module.exports = user;
