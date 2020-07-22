var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/name");

var nameSchema =new mongoose.Schema({
	name:String
});

var Name = mongoose.model("Name",nameSchema);

//console.log(Name.find());
// var meena =new Name({
// 	name:"Shubham"
// });

// meena.save(function(err,name){
// 	if(err){
// 		console.log("No");
// 	}else{
// 		console.log("added");
// 		console.log(name);
// 	}
// });
// Name.create({
// 	name:"MNIT"
// },function(err,name){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(name);
// 	}
	
// });

Name.find({},function(err,name){
	if(err){
		console.log(err);
	}else{
		console.log(name);
	}
});