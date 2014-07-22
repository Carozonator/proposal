var PDFDocument = require('pdfkit');
var fs = require('fs');
var mongoose = require('mongoose'),
Proposal = mongoose.model('Proposal');
/*
 * GET memes listing.
 */
 exports.list = function(req, res, next) {
 	Proposal.find({owner: req.user.username},function(err,proposals){
 		if (err) return next(err);
 		if (!proposals) return next("empty");
 		res.status(200).send(proposals);
 	});
 };
/* POST to addmeme */
 exports.load = function(req, res, next) {
 	Proposal.find({_id: req.body.chosen, owner: req.user.email }).exec(function(err,proposal){
 		if (err) return next(err);
 		if (!proposal) return next("empty");
 		res.status(200).send(proposal);
 	});
 };

 exports.genproposal = function() {
 	return function(req,res) {
 		console.log("------Generating Proposal by",req.body.username,"-------");
 		var pageSize = {
 			width: 1294,
 			height: 999
 		};
 		var count = 0;
 		var doc = new PDFDocument({layout:'landscape',margin: 0,size:[1003.00, 1298.00]});
 		var stream = doc.pipe(fs.createWriteStream('public/pdf/' + req.body.proposalname+"_"+req.body.usernamewho + '.pdf'));
	    // Iterate through the pages
	    req.body.pages.forEach(function(page){
	    	if (count !== 0) {
	    		doc.addPage();
	    	}
	    	console.log(count);
	    	formatPage(doc,page,pageSize);
	    	addTextBodies(page.pagesetup.textbody,pageSize,doc);
	    	addImages(page.pagesetup.imagearea,pageSize,doc);
	    	page.pagesetup.etc.sort(sortfunction);
	    	addEtc(page.pagesetup.etc,pageSize,doc,page,true);
	    	count += 1;
	    });
	    doc.end();
	    stream.on('finish', function() {
	    	res.send(200);
	    });
	};
};

exports.addProposal = function(req, res, next) {
	Proposal.findOneAndUpdate({proposalname:req.body.proposalname},req.body,{upsert:true},function(err,proposal){
		if (err) {
			res.status(400).send('There was an error.');
			return;
		}
		res.status(200).send('Success!');
	});
};

exports.delete = function(req,res){
	Proposal.remove({_id : req.params.id},function(err){
		if (err) return next(err);
		var fileurl='public/pdf/'+req.params.name+"_"+req.user.email+".pdf";
		fs.exists(fileurl, function (exists) {
			if (exists){
				fs.unlink(fileurl, function (err) {
					if (err) throw err;
					console.log('successfully deleted '+fileurl);
				});
				res.status(200).send("success!");
			}
		});
	});
}
 
 function serviceTable(doc,item,pageSize,page) {
 	var tableinfo=item.settings.pagetext;
 	var contentLength = 0;
 	var x=(item.settings.xpos/100)*pageSize.width;
 	var y=(item.settings.ypos/100)*pageSize.height;
 	var width=(item.settings.width/100)*pageSize.width;
 	var height=(item.settings.height)*pageSize.height;
	discount=parseFloat(item.settings.discount);
	tax=parseFloat(item.settings.tax);
 	doc.moveTo(x,y)
    //TITLE OF THE TABLE
    .fontSize(30)
    .fillColor(item.settings.color).font(item.settings.font)
    .text("SERVICE ", x, y+20, {width:460, continued:true})
    .text("OFFERING");
    // HEADINGS OF THE TABLE
    doc.fontSize(22)
    .text("SERVICE", x, y+70)
    .text("TIMEFRAME", x+(width/3), y+70)
    .text("SUBTOTAL", x+(width*(2/3)), y+70, {width:122,align:'right'});
    // CALCULATION AND FILL IN THE TABLE
    var priceSubTotal = 0;
    //iterate over the packages
    for (var i=0;i<tableinfo.length;i++) {
    	contentLength += (tableinfo[i].pservice.length + 1);
    	var startPos = 23 * (contentLength - tableinfo[i].pservice.length - 1) + y+105;
    	var height =22.5 * tableinfo[i].pservice.length + 23 ;
    	var midPos =22.5 * (Math.floor(tableinfo[i].pservice.length/2)) + startPos;
    	var bottomLimit=0;
    	if (page.pagesetup.footer.exists){
    		bottomLimit=((page.pagesetup.footer.settings.height/100)*pageSize.height)
    	}
    	if ((startPos+height)>=(pageSize.height-bottomLimit)){
    		doc.addPage();
    		formatPage(doc,page,pageSize);
    		addTextBodies(page.pagesetup.textbody,pageSize,doc);
    		addImages(page.pagesetup.imagearea,pageSize,doc);
    		addEtc(page.pagesetup.etc,pageSize,doc,page,false);
    		contentLength = 0;
    		x=(item.settings.xpos/100)*pageSize.width;
    		y=(item.settings.ypos/100)*pageSize.height;
    		width=(item.settings.width/100)*pageSize.width;
    		height=(item.settings.height)*pageSize.height;
    		startPos = y;
    		midPos =22.5 * (Math.floor(tableinfo[i].pservice.length/2)) + startPos;
    	}
    	doc.fontSize(14).fillColor(item.settings.color).font(item.settings.font)
    	.text(tableinfo[i].ptime, x+(width/3), midPos)
    	.text(tableinfo[i].psub, x+(width*(2/3)), midPos, {width:122,align:'right'})
    	.text(tableinfo[i].pname, x, startPos);
        // Iterate over the services
        for (var j=0;j<tableinfo[i].pservice.length;j++) {
        	if (tableinfo[i].pservice[j].text !== "") {
        		doc.moveDown(0.25).text("»   "+tableinfo[i].pservice[j].text, {indent:20});
        	}
        }
        priceSubTotal += parseFloat(tableinfo[i].psub);
    }
    grandTotal = priceSubTotal - discount;
    grandTotal= (1-(tax/100))*grandTotal;
    if (priceSubTotal.length > 3) {
    	priceSubTotal = priceSubTotal.toString().slice(0,-3) + ',' + priceSubTotal.toString().slice(-3);
    }
    if (discount.length > 3) {
    	discount = discount.toString().slice(0,-3) + ',' + discount.toString().slice(-3);
    }
    if (grandTotal.length > 3) {
    	grandTotal = grandTotal.toString().slice(0,-3) + ',' + grandTotal.toString().slice(-3);
    }
    doc.fontSize(14)
    .font(item.settings.font)
    .text('Sub Total: ',x+(width*(2/3)),21 * contentLength + y+125,{continued:true})

    .text("$"+priceSubTotal);
    if (discount !== 0) {
    	doc
    	.text('Discount: ',{continued:true})
    	.text("$"+discount);  
    }if (tax !== 0) {
    	doc
    	.text('Tax: ',{continued:true})
    	.text("%"+tax);  
    }
    doc
    .text('Total: ',{continued:true})
    .text("$"+grandTotal);
}

function formatPage(doc,page,pageSize) {
  // Check Settings for Background
  if (page.background.image === false) {
  	console.log("Coloring Background");
  	doc.rect(0,0,pageSize.width,pageSize.height).fillAndStroke(page.background.color);
  } else {
  	console.log("Image on Background",page.background.source,"|");
  	doc.image("public/icons/"+page.background.source, 0, 0, {width: pageSize.width, height: pageSize.height});
  }
      //Check Settings for Header
      if (page.pagesetup.header.exists === true) {
      	console.log("Creating Header");
      	if (page.pagesetup.header.settings.image === false) {
      		doc.rect(0,0,pageSize.width,
      			(page.pagesetup.header.settings.height/100)*pageSize.height)
      		.fillAndStroke(page.pagesetup.header.settings.color);
      	} else {
      		var path = 'public/icons/'+page.pagesetup.header.settings.source;
      		doc.image(path, 0, 0, 
      			{width: pageSize.width, height: (page.pagesetup.header.settings.height/100)*pageSize.height});
      	}
      }
      //Check Settings for Footer
      if (page.pagesetup.footer.exists === true) {
      	if (page.pagesetup.footer.settings.image === false) {
      		doc.rect(0,pageSize.height-((page.pagesetup.footer.settings.height/100)*pageSize.height),
      			pageSize.width,
      			(page.pagesetup.footer.settings.height/100)*pageSize.height)
      		.fillAndStroke(page.pagesetup.footer.settings.color);
      	} else { 
      		var path = 'public/icons/'+page.pagesetup.footer.settings.source;
      		doc.image(path, 0, pageSize.height-((page.pagesetup.footer.settings.height/100)*pageSize.height), {width: pageSize.width, height: (page.pagesetup.footer.settings.height/100)*pageSize.height});
      	}
      }
      //Iterate through Headings
      page.pagesetup.heading.forEach(function(heading){
      	if (heading.exists === true) {
      		var fontType =heading.settings.font;
      		if ((heading.settings.bold)||(heading.settings.italic)){
      			fontType=fontType+"-";
      			if (heading.settings.bold){
      				fontType=fontType+"Bold";
      			}
      			if (heading.settings.italic){
      				fontType=fontType+"Oblique";
      			}}
      			doc.fontSize(heading.settings.size)
      			.fillColor(heading.settings.color)
      			.font(fontType)
      			.text(heading.content ? heading.content : "", 
      				(heading.settings.xpos/100) * pageSize.width, 
      				(heading.settings.ypos/100) * pageSize.height, 
      				{ width:(heading.settings.width/100)*pageSize.width,
      					underline:heading.settings.underline});
      		}
      	});
  }

  function addImages(images,pageSize,doc){
  	images.forEach(function(imagearea){
  		if (imagearea.exists === true) {
  			var path = 'public/icons/'+imagearea.settings.defaultimage;
  			if (imagearea.settings.defaultimage==''){
  				path='public/icons/unknownProduct.png';
  			}
  			doc.image(imagearea.content ? imagearea.content : path, 
  				(imagearea.settings.xpos/100) * pageSize.width, 
  				(imagearea.settings.ypos/100) * pageSize.height, 
  				{  width: (imagearea.settings.width/100)*pageSize.width, 
  					height: (imagearea.settings.height/100)*pageSize.height});
  		}
  	});
  }

  function addEtc(etc,pageSize,doc,page,isFirst){
  	etc.forEach(function(etc){
  		if (etc.exists === true) {
  			if (etc.assettype === "box") {
  				console.log("Generating Box");
  				doc.rect((etc.settings.xpos/100)*pageSize.width,
  					(etc.settings.ypos/100)*pageSize.height,
  					(etc.settings.width/100)*pageSize.width,
  					(etc.settings.height/100)*pageSize.height).
  				fillAndStroke(etc.settings.background.color);
  			} else if (etc.assettype === "table") {
  				console.log("Generating Table");
  				var fontType = etc.settings.font;
  				if ((etc.settings.bold)||(etc.settings.italic)){
  					fontType=fontType+"-";
  					if (etc.settings.bold){
  						fontType=fontType+"Bold";
  					}
  					if (etc.settings.italic){
  						fontType=fontType+"Oblique";
  					}
  				}
  				var x=etc.settings.xpos;
  				var y=etc.settings.ypos;
  				var cellWidth=etc.settings.width/etc.settings.columns;
  				var cellHeight=etc.settings.height/etc.settings.rows;
  				var tableValues=new Array(etc.settings.columns);
  				for (var i=0;i<etc.settings.columns;i++){
  					tableValues[i]=new Array(etc.settings.rows);
  				}
  				for (var i=0;i<etc.settings.columns*etc.settings.rows;i++){
  					tableValues[etc.content[i].col][etc.content[i].row]=etc.content[i].text;
  				}

  				for (var i=0;i<etc.settings.rows;i++){
  					for (var j=0;j<etc.settings.columns;j++){
  						var xPos=(x/100)*pageSize.width;
  						var yPos=(y/100)*pageSize.height;
  						xPos=xPos+((((cellWidth)/100)*pageSize.width)*0.05);
  						yPos=yPos+((((cellHeight)/100)*pageSize.height)*0.05);
  						var textWidth=(((cellWidth)/100)*pageSize.width)*0.9;
  						var textHeight= (((cellHeight)/100)*pageSize.height)*0.9;
  						var rows=Math.floor((textHeight/2*tableValues[j][i].length)/textWidth)+1;
  						doc.fontSize(textHeight/rows)
  						.fillColor(etc.settings.color)
  						.font(fontType)
  						.text(   tableValues[j][i], 
  							xPos,
  							yPos,
  							{   width:textWidth,
  								height:textHeight,
  								align:"justify"
  							}
  							);

  						doc.rect((x/100)*pageSize.width,
  							(y/100)*pageSize.height,
  							((cellWidth)/100)*pageSize.width,
  							((cellHeight)/100)*pageSize.height);
  						if (etc.settings.borderexists){
  							doc.stroke(etc.settings.bordercolor);
  						}
  						x+=cellWidth;
  					}   
  					y+= cellHeight;
  					x=etc.settings.xpos;
  				}  
  			}else if ((etc.assettype === "pricing")&& (isFirst)) {
  				console.log("Generating Pricing Table");
  				serviceTable(doc,etc,pageSize,page);         
  			}
  		}
  	});
}

function addTextBodies(textbody,pageSize,doc){
	console.log("Generating TextBodies");
	textbody.forEach(function(textbody){
		if (textbody.exists === true) {
			var fontType =textbody.settings.font;
			if ((textbody.settings.bold)||(textbody.settings.italic)){
				fontType=fontType+"-";
				if (textbody.settings.bold){
					fontType=fontType+"Bold";
				}
				if (textbody.settings.italic){
					fontType=fontType+"Oblique";
				}
			}
			doc.fontSize(textbody.settings.size)
			.fillColor(textbody.settings.color)
			.font(fontType)
			.text(textbody.content ? textbody.content : "", 
				(textbody.settings.xpos/100) * pageSize.width, 
				(textbody.settings.ypos/100) * pageSize.height, 
				{
					width:(textbody.settings.width/100)*pageSize.width,
					height:(textbody.settings.height/100)*pageSize.height,
					align:"justify",
					underline:textbody.settings.underline
				});
		}
	});
}

function sortfunction(a, b){
	return (a.assettype.length>b.assettype.length);
}