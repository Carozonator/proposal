var mongoose = require('mongoose'),
Schema = mongoose.Schema,
crypto = require('crypto');

var UserSchema = new Schema({
							name: {
								type: String,
								required: true
							},
							lastname: {
								type: String,
								required: true
							},
							email: {
								type: String,
								required:true,
								unique: true
							},
							username:{
								type:String,
								required:true,
								unique:true
							},
							companyName: {
								type: String,
								required: true
							},
							companySize: {
								type: String,
								required: true
							},
							roles: {
								type: Array,
								default: ['authenticated']
							},
							hashed_password: String,
							provider: String,
							salt: String,
							facebook: {}
});

UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.hashPassword(password);
}).get(function() {
  return this._password;
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

UserSchema.path('name').validate(function(name) {
  if (!this.provider) return true;
  return (typeof name === 'string' && name.length > 0);
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
  if (!this.provider) return true;
  return (typeof email === 'string' && email.length > 0);
}, 'Email cannot be blank');

UserSchema.path('lastname').validate(function(lastname) {
  if (!this.provider) return true;
  return (typeof lastname === 'string' && lastname.length > 0);
}, 'Lastname cannot be blank');

UserSchema.path('companyName').validate(function(companyName) {
  if (!this.provider) return true;
  return (typeof companyName === 'string' && companyName.length > 0);
}, 'Company cannot be blank');

UserSchema.path('companySize').validate(function(companySize) {
  if (!this.provider) return true;
  return (typeof companySize === 'string' && companySize.length > 0);
}, 'Company Size cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
  if (!this.provider) return true;
  return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, 'Password cannot be blank');

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.provider)
    next(new Error('Invalid password'));
  else
    next();
});

UserSchema.methods = {
  hasRole: function(role) {
    var roles = this.roles;
    return (roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1);
  },
  authenticate: function(plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
  },
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },
  hashPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);