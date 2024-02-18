
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true  
	}
});

//Image is a model which has a schema imageSchema


const image =  mongoose.model("Image", imageSchema);

module.exports = image;