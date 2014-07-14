var fs = require('fs');

/*
 * GET images listing.
 */

 exports.imageList = function(db) {
  return function(req, res) {
    db.collection('imglist').find().toArray(function(err, items) {
      res.json(items);
    });
  }
};

exports.iconList = function(db) {
  return function(req, res) {
    db.collection('iconlist').find().toArray(function(err, items) {
      res.json(items);
    });
  }
};

/*
 * POST to upload image
 */

 exports.uploadIcon = function(req,res,next) {
    
   var oldPath = req.files.file.path;
   fs.readFile(oldPath, function (err, data) {
    var fileName = req.files.file.originalFilename;
    fs.rename(oldPath, 'public/icons/' + fileName, function (err) {
        console.log('public/icons/' + fileName);
      if (err) return next(err);
      res.status(200).send("Success!");
    });
  });
 };

 /* POST to DELETE */

 exports.deleteimage = function(db) {
   return function(req, res) {
     var bgToDelete = req.body.id;
     db.collection('iconlist').removeById(bgToDelete, function(err, result) {
       res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
     });
   }
 };