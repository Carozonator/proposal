var mongoose = require('mongoose'),
ProposalPage = mongoose.model('Proposalpage');
/*
 * GET pages listing.
 */
exports.list = function(req, res, next) {
  ProposalPage.find({ typeowner: req.user.email },{ _id: false },function(err,proposals){
    if (err) return next(err);
    if (!proposals) return next("empty");
    res.status(200).send(proposals);
  });
};
exports.delete = function(req,res){
    console.log("deleting page");
     ProposalPage.remove({ typeowner: req.user.email,typename: req.params.name },function(err,proposals){
    if (err) return next(err);
    if (!proposals) return next("empty");
        res.status(200).send("success!");
  });
}
/*
 * POST to addmeme
 */
exports.add = function(req, res, next) {

  ProposalPage.findOneAndUpdate(
          {"typename":req.body.typename, typeowner: req.user.email},
  req.body,{upsert:true},function(err,proposal){
    if (err) {
      res.status(400).send('There was an error.');
      return;
    }
    res.status(200).send('Success!');
  });
};
/*
 * DELETE to deletememe
 */
exports.deletememe = function(db) {
   return function(req, res) {
     var memeToDelete = req.body.id;
     db.collection('memelist').removeById(memeToDelete, function(err, result) {
       res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
     });
   }
 };