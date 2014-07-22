var mongoose = require('mongoose'),
User = mongoose.model('User');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('ySuiNhgR1E45Q5sfieuIvA');

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
exports.deleteAccount = function(req,res){
	console.log("delete");
	User.remove({email : req.params.email},function(err){
		console.log('successfully deleted ');
		res.status(200).send("Account",req.params.email,"deleted");
	});
}
exports.updateUser=function(req,res,next){
	User.findOne({email:req.body.newEmail},function(err,userfind){
		if (!userfind){
			User.findOne({email:req.body.email},function(err,doc){
				if (err) res.status(400).send("querelajo");
				var newUser=User(req.body);
				newUser.email=req.body.newEmail;
				newUser.password=req.body.newPassword;
				newUser.makeSalt();
				newUser.hashPassword(req.body.newPassword);
				doc.name=newUser.name;
				doc.email=newUser.email;
				doc.hashed_password=newUser.hashed_password;
				doc.save();
			});
		}else{
	      	res.status(400).send('This new email is already in use.');
	    }
	});
}

function sendMail (email,name){
	console.log(email,name);
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
