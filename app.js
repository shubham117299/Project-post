var express 	=	require("express"),
	app 		=	express(),
	bodyParser  =	require("body-parser"),
	passport 	=	require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	User 		=	require("./models/user"),
	Comment     =  require("./models/comment"),  
	mongoose 	=   require("mongoose")

var fs = require('fs'); 
var path = require('path'); 
 var multer = require('multer'); 
     require('dotenv/config'); 


 //mongoose.connect("mongodb://localhost/name",{useNewUrlParser:true, useUnifiedTopology: true });

mongoose.connect("mongodb+srv://shubham:Shubham@9189@shubh.tv9gf.mongodb.net/<dbname>?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
//

var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer'); 
  
var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
});

var upload = multer({ storage: storage });
//LIFE

var lifeSchema =new mongoose.Schema({
	name:String,
	image:{ 
        data: Buffer, 
        contentType: String 
    },
	caption:String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username : String
	},
	comments :[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]

});



var Life =mongoose.model("Life",lifeSchema);

//EDUCATION
var educationSchema =new mongoose.Schema({
	name:String,
	image:String,
	caption:String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username : String
	},
	comments :[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
	

});

var Education =mongoose.model("Education",educationSchema);

//TRAVEL

var travelSchema =new mongoose.Schema({
	name:String,
	image:String,
	caption:String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username : String
	}

});

var Travel =mongoose.model("Travel",travelSchema);

//Friends

var friendSchema =new mongoose.Schema({
	name:String,
	image:String,
	caption:String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username : String
	}

});

var Friend =mongoose.model("Friend",friendSchema);


//SPACE

var spaceSchema =new mongoose.Schema({
	name:String,
	image:String,
	caption:String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username : String
	}

});

var Space =mongoose.model("Space",spaceSchema);


app.use(require("express-session")({
	secret: "Shubham",
	resave:false,
	saveUnitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});

app.get("/",function(req,res){
	//console.log(req.user);
	res.render("home",{currentUser:req.user});
});



app.get("/about",function(req,res){
	res.render("about");
});
//========//
//AUTH

app.get("/signup",function(req,res){
	res.render("signup",{currentUser:req.user});
});

app.post("/signup",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
	});
});

app.get("/login",function(req,res){
	res.render("login",{currentUser:req.user});
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){
	
});

app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/");
});

//USER


app.get("/profile", isLoggedIn ,function(req,res){
	//console.log(req.user._id);
	Education.find({'author.id': req.user._id}, function(err, educationpost){
	if(err) {
	console.log(err);
	} else {
	
		Friend.find({'author.id': req.user._id}, function(err, friendpost){
	if(err) {
	console.log(err);
	} else {
	
		Travel.find({'author.id': req.user._id}, function(err, travelpost){
	if(err) {
	console.log(err);
	} else {
	
		Life.find({'author.id': req.user._id}, function(err, lifepost){
	if(err) {
	console.log(err);
	} else {
	
		Space.find({'author.id': req.user._id}, function(err, spacepost){
	if(err) {
	console.log(err);
	} else {
	
		   res.render("profile",{spaceposts: spacepost,lifepost: lifepost,travelposts: travelpost,friendposts: friendpost,educationposts: educationpost});
		   //console.log()
	}
	});
	}
	});
		
	}
	});
		
	}
	});
	}
	});
	//res.render("profile");	
	
});


app.get("/profile/:id",function(req,res){
	
	Education.findById(req.params.id,function(err,foundEducation){
		if(err){
			res.redirect("/profile");
		}else{
			
			if(foundEducation!=null){
			   
				res.render("post",{found: foundEducation,username:req.user.username});
			   }else{

				   Friend.findById(req.params.id,function(err,foundFriend){
					if(err){
						res.redirect("/profile");
					}else{
						
						if(foundFriend!=null){
						   //console.log(foundEducation);
							res.render("post",{found: foundFriend});
						   }else{
							   
							   Travel.findById(req.params.id,function(err,foundTravel){
					if(err){
						res.redirect("/profile");
					}else{
						//console.log(foundEducation);
						//res.render("post",{foundEducation: foundEducation});
						if(foundTravel!=null){
						   //console.log(foundEducation);
							res.render("post",{found: foundTravel});
						   }else{
							   
							   Life.findById(req.params.id,function(err,foundLife){
					if(err){
						res.redirect("/profile");
					}else{
						
						if(foundLife!=null){
						   //console.log(foundEducation);
							res.render("post",{found: foundLife});
						   }else{
							   
							   Space.findById(req.params.id,function(err,foundSpace){
					if(err){
						res.redirect("/profile");
					}else{
						
						if(foundSpace!=null){
						   //console.log(foundEducation);
							res.render("post",{found: foundSpace});
						   }
						//res.render("post",{foundEducation: foundEducation,foundFriend: foundFriend,foundTravel: foundTravel,foundLife: foundLife,foundSpace: foundSpace});
					}
						   })
						
				}
					}
				});
							   
						   }
						
					}
				});
						   }
						
					}
				});
				   
				   
				   
			   }
			}
	});
	//res.render("edit");
	
});


//LIFE


app.get("/life",function(req,res){
	

	Life.find({},function(err,life){
		if(err){
			console.log(err);
		}else{
			res.render("life",{life:life});
			//console.log(education);
		}
	});
	//res.render("education");
});

app.post("/life", upload.single('image') ,function(req,res){
	// res.send("education post");
	var name = req.body.name;
	var image  = { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        } ;
	
	var caption = req.body.caption;
	var author ={
		id : req.user._id,
		username : req.user.username
	};
	var newLife={name:name,image:image,caption:caption,author:author}
	
	Life.create(newLife,function(err,newLife){
		if(err){
			console.log(err);
		}else{
			res.redirect("/life");
		}
	});	
});

app.get("/life/new", isLoggedIn ,function(req,res){
	res.render("lifenew");
});

app.get("/life/:id",isLoggedIn ,function(req,res){
	
	Life.findById(req.params.id).populate("comments").exec(function(err,foundLife){
		if(err){
			res.redirect("/life");
		}else{
			//console.log(foundLife)
			res.render("lifepost",{found: foundLife});
			}
	});
	//res.render("edit");
	
});

app.post("/life/:id",isLoggedIn ,function(req,res){
	
	Life.findById(req.params.id,function(err,life){
		if(err){
			console.log(err);
			res.redirect("/life");
		}else{
			
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					life.comments.push(comment);
					life.save();
					res.redirect('/life/' + life._id);
				}
			});
		}
	})
	
});


//EDUCATION

app.get("/education",function(req,res){
	

	Education.find({},function(err,education){
		if(err){
			console.log(err);
		}else{
			res.render("education",{education:education});
			//console.log(education);
		}
	});
	//res.render("education");
});

app.post("/education", isLoggedIn ,function(req,res){
	// res.send("education post");
	var name = req.body.name;
	var image  = req.body.image;
	var caption = req.body.caption;
	var author ={
		id : req.user._id,
		username : req.user.username
	};
	var newEducation={name:name,image:image,caption:caption,author:author}
	
	Education.create(newEducation,function(err,newEducation){
		if(err){
			console.log(err);
		}else{
			res.redirect("/education");
		}
	});	
});

app.get("/education/new", isLoggedIn ,function(req,res){
	res.render("educationnew");
});


app.get("/education/:id",isLoggedIn ,function(req,res){
	
	Education.findById(req.params.id).populate("comments").exec(function(err,foundEducation){
		if(err){
			res.redirect("/education");
		}else{
			//console.log(foundEducation);
			res.render("educationpost",{found: foundEducation});
			}
	});
	//res.render("edit");
	
});

app.post("/education/:id",isLoggedIn ,function(req,res){
	
	Education.findById(req.params.id,function(err,education){
		if(err){
			console.log(err);
			res.redirect("/education");
		}else{
			
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					education.comments.push(comment);
					education.save();
					res.redirect('/education/' + education._id);
				}
			});
		}
	})
	
});



app.get("/travel",function(req,res){
	Travel.find({},function(err,travel){
		if(err){
			console.log(err);
		}else{
			res.render("travel",{travel:travel});
			//console.log(education);
		}
	});
	//res.render("education");
});

app.post("/travel",isLoggedIn ,function(req,res){
	// res.send("education post");
	var name = req.body.name;
	var image  = req.body.image;
	var caption = req.body.caption;
	var author ={
		id : req.user._id,
		username : req.user.username
	};
	var newTravel={name:name,image:image,caption:caption,author:author}
	
	Travel.create(newTravel,function(err,newTravel){
		if(err){
			console.log(err);
		}else{
			res.redirect("/travel");
		}
	});	
});

app.get("/travel/new", isLoggedIn ,function(req,res){
	res.render("travelnew");
});


app.get("/travel/:id",isLoggedIn ,function(req,res){
	
	Travel.findById(req.params.id,function(err,foundTravel){
		if(err){
			res.redirect("/travel");
		}else{
			res.render("travelpost",{found: foundTravel});
			}
	});
	
	
});

app.post("/education/:id",isLoggedIn ,function(req,res){
	
	Education.findById(req.params.id,function(err,education){
		if(err){
			console.log(err);
			res.redirect("/education");
		}else{
			
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					education.comments.push(comment);
					education.save();
					res.redirect('/education/' + education._id);
				}
			});
		}
	})
	
});




//Friends

app.get("/friend",function(req,res){
	Friend.find({},function(err,friend){
		if(err){
			console.log(err);
		}else{
			res.render("friend",{friend:friend});
			//console.log(education);
		}
	});
	//res.render("education");
});

app.post("/friend", isLoggedIn ,function(req,res){
	// res.send("education post");
	var name = req.body.name;
	var image  = req.body.image;
	var caption = req.body.caption;
	var author ={
		id : req.user._id,
		username : req.user.username
	};
	var newFriend={name:name,image:image,caption:caption,author:author}
	
	Friend.create(newFriend,function(err,newFriend){
		if(err){
			console.log(err);
		}else{
			res.redirect("/friend");
		}
	});	
});

app.get("/friend/new", isLoggedIn ,function(req,res){
	res.render("friendnew");
});

app.get("/friend/:id",isLoggedIn ,function(req,res){
	
	Friend.findById(req.params.id,function(err,foundFriend){
		if(err){
			res.redirect("/friend");
		}else{
			res.render("friendpost",{found: foundFriend});
			}
	});
	
	
});

app.post("/education/:id",isLoggedIn ,function(req,res){
	
	Education.findById(req.params.id,function(err,education){
		if(err){
			console.log(err);
			res.redirect("/education");
		}else{
			
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					education.comments.push(comment);
					education.save();
					res.redirect('/education/' + education._id);
				}
			});
		}
	})
	
});

//SPACE


app.get("/space",function(req,res){
	Space.find({},function(err,space){
		if(err){
			console.log(err);
		}else{
			res.render("space",{space:space});
			//console.log(education);
		}
	});
	//res.render("education");
});

app.post("/space",function(req,res){
	// res.send("education post");
	var name = req.body.name;
	var image  = req.body.image;
	var caption = req.body.caption;
	var author ={
		id : req.user._id,
		username : req.user.username
	};
	var newSpace={name:name,image:image,caption:caption,author:author}
	
	Space.create(newSpace,function(err,newSpace){
		if(err){
			console.log(err);
		}else{
			res.redirect("/space");
		}
	});	
});

app.get("/space/new",function(req,res){
	res.render("spacenew");
});

app.get("/space/:id",isLoggedIn ,function(req,res){
	
	Space.findById(req.params.id,function(err,foundSpace){
		if(err){
			res.redirect("/space");
		}else{
			res.render("spacepost",{found: foundSpace});
			}
	});
	
	
});

app.post("/education/:id",isLoggedIn ,function(req,res){
	
	Education.findById(req.params.id,function(err,education){
		if(err){
			console.log(err);
			res.redirect("/education");
		}else{
			
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					education.comments.push(comment);
					education.save();
					res.redirect('/education/' + education._id);
				}
			});
		}
	})
	
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
	   	return next();
	   }
	res.redirect("/login");
}

app.listen(process.env.PORT || 3000, process.env.IP,function(){
	console.log("your project is ready to go...");  
});
