var mongoose = require('mongoose'),
User = mongoose.model('User');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('ySuiNhgR1E45Q5sfieuIvA');
var crypto = require('crypto');

exports.authCallback = function(req, res) {
	console.log("authcallback");
	res.redirect('/hub');
};

exports.signin = function(req, res) {
	if (req.isAuthenticated()) {
		console.log("signin");
		return res.redirect('/hub');
	}
	res.redirect('/login');
};

exports.signout = function(req, res) {
	console.log("signout");
	req.logout();
	res.redirect('/');
};

exports.session = function(req, res) {
	console.log("session");
	res.redirect('/hub');
};

exports.create = function(req, res, next) { 
	User.findOne({email:req.body.email},function(err,userfind){
		if (userfind == null) {
			var user = new User(req.body);
			user.username=req.body.email;
			user.provider = 'local';
			req.assert('email', 'You must enter a valid email.').isEmail();
			req.assert('password', 'Password must be between 8-20 characters long.').len(5,20);
			req.assert('lastname', 'Lastname cannot be more than 20 characters.').len(1,20);
			req.assert('confirmPassword', 'Passwords do not match.').equals(req.body.password);
			req.assert('confirmEmail', 'Emails do not match.').equals(req.body.email);
			var errors = req.validationErrors();
			if (errors) {
				return res.status(400).send(errors);
			}
			user.roles = ['authenticated'];
			user.save(function(err){
			if (err) {
				console.log(err);
				switch(err.code) {
					case 11000:
					case 11001:
					res.status(400).send('Email already taken.');
					break;
					default:
					res.status(400).send('Please fill all the required fields.');
				}
			}
			req.logIn(user, function(err){
				if (err) return next(err);
				return;
			});
			// sendMail(req.body.email,req.body.name);
			console.log("User Created:",req.body.email);
			
			res.status(200).send("Success");
			}); 
		} else {
			res.status(400).send('This email is already in use.');
		}
	});
};

exports.me = function(req, res) {
	console.log("me");
	res.jsonp(req.user || null);
};

exports.user = function(req, res, next, id) {
	console.log("user");
	User.findOne({
		_id: id
	}).exec(function(err,user){
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};
exports.forgotPassword = function(req,res,next){
	console.log("Forget password");
	var newPassword=getRandomInt().join("");
	User.findOne({email:req.body.email},function(err,doc){
		if (err) res.status(400).send("Error");
		if (doc){
			var newUser=User(doc);
			newUser.password=newPassword;
			newUser.makeSalt();
			doc.salt=newUser.salt;
			newUser.hashPassword(newPassword);
			doc.hashed_password=newUser.hashed_password;
			doc.save();
		}else {
			res.status(400).send("Not existing User");
		}
	});
	recoverPasswordMail(req.body.email,"Julio",newPassword);
	res.status(200).send("sending password bro !");
}
function getRandomInt() {
	var newPassword=new Array();
	var min=48;
	var max=122;
	for (var i=0;i<8;i++){
		newPassword.push( String.fromCharCode(Math.floor(Math.random() * (max - min)) + min));
	}
	return newPassword;
}
exports.deleteAccount = function(req,res){
	console.log("delete",req.params);
	User.remove({_id : req.params.id},function(err){
		console.log('successfully deleted ');
		res.status(200).send("Account",req.params.email,"deleted");
		res.redirect('/');
	});
}
exports.updateUser=function(req,res,next){
	User.findOne({email:req.body.email},function(err,doc){
		var user=User(doc);
		if (!user.authenticate(req.body.password)){ 
			res.status(400).send('Incorrect Password');
			return;
		}
		if (err) res.status(400).send("Error");
		var newUser=User(req.body);
		doc.name=newUser.name;
		doc.lastname=newUser.lastname;
		doc.companyName=newUser.companyName;
		doc.companySize=newUser.companySize;
		doc.save();
		if (req.body.newEmail){
			User.findOne({email:req.body.newEmail},function(err,userfind){
				if (!userfind){
					newUser.email=req.body.newEmail;
					doc.email=newUser.email;
					doc.save();
				}else{
					res.status(400).send('This new email is already in use.');
					return;
				}
			});
		}
		if (req.body.newPassword){
			newUser.password=req.body.newPassword;
			newUser.makeSalt();
			doc.salt=newUser.salt;
			newUser.hashPassword(req.body.newPassword);
			doc.hashed_password=newUser.hashed_password;
			doc.save();
		}
		res.status(200).send('User Updated!');
	});
}
function recoverPasswordMail(email,name,newPassword){
	var template_name = "new";
	var template_content = [{
	        "name": "HOLA",
	        "content": "QUE PASOOO"
	    }];
	var message = {
	    "html": "<p>"+name+" Welcome to BLK ! NEW PASSWORD="+newPassword+"</p>",
	    "text": "Welcome to BLK! "+name,
	    "subject": "Welcome!"+newPassword,
	    "from_email": "info@businesslabkit.com",
	    "from_name": "BLK Team",
	    "to": [{
	            "email": email,
	            "name": name,
	            "type": "to"
	        }],
	    "headers": {
	        "Reply-To": "info@businesslabkit.com"
	    }
	};
	var async = false;
	mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async}, function(result) {
	    console.log(result);
	    /*
	    [{
	            "email": "recipient.email@example.com",
	            "status": "sent",
	            "reject_reason": "hard-bounce",
	            "_id": "abc123abc123abc123abc123abc123"
	        }]
	    */
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
}
function sendMail (email,name){
	var template_name = "new";
	var template_content = [{
	        "name": "HOLA",
	        "content": "QUE PASOOO"
	    }];
	var message = {
	    "html": "<p>"+name+" Welcome to BLK !</p>",
	    "text": "Welcome to BLK! "+name,
	    "subject": "Welcome!",
	    "from_email": "info@businesslabkit.com",
	    "from_name": "BLK Team",
	    "to": [{
	            "email": email,
	            "name": name,
	            "type": "to"
	        }],
	    "headers": {
	        "Reply-To": "info@businesslabkit.com"
	    }
	};
	var async = false;
	mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async}, function(result) {
	    console.log(result);
	    /*
	    [{
	            "email": "recipient.email@example.com",
	            "status": "sent",
	            "reject_reason": "hard-bounce",
	            "_id": "abc123abc123abc123abc123abc123"
	        }]
	    */
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
};
