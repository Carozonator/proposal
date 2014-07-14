'use strict';
/* Controllers */
var appCtrl = angular.module('app');
 appCtrl.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
     console.log($location.path());
 });
// Home Controller
appCtrl.controller('homeCtrl', ['$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http) {
		$scope.messages = {};
		function loadMessages() {
			$http.get('/api/secured/message').success(function(data) {
				$scope.messages.secured = data.message || data.error;
			});
			$http.get('/api/message').success(function(data) {
				$scope.messages.unsecured = data.message || data.error;
			});
		}
		var deregistration = $rootScope.$on('session-changed', loadMessages);
		$scope.$on('$destroy', deregistration);
		loadMessages();
	}]);

// Login CONTROLLER
appCtrl.controller('loginCtrl', ['$scope','$http',function($scope,$http) {
	$scope.userInfo = {};
}]);

// REGISTRATION CONTROLLER
appCtrl.controller('registrationCtrl', ['$scope','$http', function($scope,$http) {
	$scope.userInfo = {};
}]);

// BUILDER CONTROLLER
appCtrl.controller('builderCtrl', ['$scope','$rootScope','$http','$window','$location', function($scope,$rootScope,$http,$window,$location) {
    // Setting up Variables
    // Array of pages
    $scope.pageTypes = [];
    // Set the user
    $scope.username = $rootScope.email;
    // Set the default preview on load
    $scope.pagePreview = {
    	typename: "New Page Type",
    	typeowner: $scope.username,
    	background: {
    		image: false,
    		color: "#ffffff",
    		source: ""
    	},
    	pagesetup: {
    		header: {
    			exists: false,
    			settings: {
    				image: false,
    				color: "#000000",
    				source: "",
    				height: 10
    			}
    		},
    		footer: {
    			exists: false,
    			settings: {
    				image: false,
    				color: "#000000",
    				source: "",
    				height: 10
    			}
    		},
    		heading: [],
    		textbody: [],
    		imagearea: [],
    		etc: []
    	}
    };
		var width = $window.innerWidth;
  
    	var x0=width*0.4145;
    	var x1=width-(width*0.05);
    	$scope.marginObject=x0;
    	$scope.objectMargin=x0;
    	$scope.previewPageWidth = x1-x0-50;
    	$scope.previewPageHeight = 375;
    	$scope.previewPageMT = 0;
    	$scope.previewPageML = 0;
    	$scope.containerHeight = 375;
    	
    $scope.addNewPageType = function() {
    	var confirm = $window.confirm("Page not yet saved. Please press CANCEL and save so changes will not be lost.");
    	if (confirm == false) {
    		return;
    	}
    	$scope.pagePreview = {
    		typename: "New Page Type",
    		typeowner: $scope.username,
    		background: {
    			image: false,
    			color: "#ffffff",
    			source: ""
    		},
    		pagesetup: {
    			header: {
    				exists: false,
    				settings: {
    					image: false,
    					color: "#000000",
    					source: "",
    					height: 10
    				}
    			},
    			footer: {
    				exists: false,
    				settings: {
    					image: false,
    					color: "#000000",
    					source: "",
    					height: 10
    				}
    			},
    			heading: [],
    			textbody: [],
    			imagearea: [],
    			etc: []
    		}
    	};
    };
     $scope.loadPageTypes = function() {
         	$http.get('/proposalpage').success(function(res){
    		$scope.pageTypes = res;
    	}).error(function(){
    		console.log("There was an error.");
    	});
    };
    $scope.generatePreview = function(index) {
    	var confirm = $window.confirm("Page not yet saved. Please press CANCEL and save so changes will not be lost.");
    	if (confirm == false) {
    		return;
    	}
    	var pagetypeinfo = $scope.pageTypes[index];
    	$scope.pagePreview = $scope.pageTypes[index];
    	$scope.currentPreview = index;
    };
    $scope.toggleHeader = function() {
    	$scope.pagePreview.pagesetup.header.exists = !$scope.pagePreview.pagesetup.header.exists;
    };
    $scope.toggleFooter = function() {
    	$scope.pagePreview.pagesetup.footer.exists = !$scope.pagePreview.pagesetup.footer.exists;
    };
    $scope.addHeading = function() {
    	$scope.pagePreview.pagesetup.heading.push({
    		exists: true,
    		content: "",
    		settings: {
    			xpos: 10,
    			ypos: 30,
    			width: 80,
    			height: 10,
    			size: 40,
    			font: "Helvetica",
    			underline:false,
    			bold:false,
    			italic:false,
    			color:"#000000"
    		}
    	});
    };
    $scope.addText = function() {
    	$scope.pagePreview.pagesetup.textbody.push({
    		exists: true,
    		content: "",
    		settings: {
    			xpos: 10,
    			ypos: 30,
    			width: 80,
    			height: 10,
    			size: 10,
    			font: "Helvetica",
    			bold:false,
    			underline:false,
    			italic:false,
    			color:"#000000"
    		}
    	});
    };
    $scope.addImage = function() {
    	$scope.pagePreview.pagesetup.imagearea.push({
    		exists: true,
    		settings: {
    			xpos: 10,
    			ypos: 30,
    			width: 40,
    			height: 10,
    			defaultimage: ""
    		}
    	});
    };
    $scope.addBox = function() {
    	$scope.pagePreview.pagesetup.etc.push({
    		exists: true,
    		assettype: "box",
    		settings: {
    			xpos: 10,
    			ypos: 10,
    			width: 10,
    			height: 10,
    			opacity: 1,
    			background: {
    				image: false,
    				color: "#343533",
    				source: ""
    			}
    		}
    	});
    }; 
    $scope.addPricingTable = function() {
    	$scope.pagePreview.pagesetup.etc.push({
    		exists: true,
    		assettype: "pricing",
    		content: "",
    		settings: {
    			xpos: 20,
    			ypos: 20,
    			width: 60,
    			height: 10,
    			columns: 3,
    			font:"Helvetica",
    			color:"#000000",
    			background: {
    				image: false,
    				color: "#343533",
    				source: ""
    			},
    			existsDiscount:false,
    			discount:0,
    			existsTax:false,
    			tax:0,
    			pagetext: [{  pname: "Branding Package",
    			pservice: [{text:"Logo"},{
    				text:"Branding Guide"},{
    					text:"Letterhead"},{
    						text:"Business Card Templates"}],
    						psub: "$5,000.00",
    						ptime: "1 Month"}],
    						pagetitle: false,
    						pagetype: "tablepage"
    					}
    				});
    };
    $scope.addTable = function() {
    	$scope.pagePreview.pagesetup.etc.push({
    		exists: true,
    		assettype: "table",
    		content: [{col:0,row:0,text:""},{col:1,row:0,text:""},{col:2,row:0,text:""}],
    		settings: {
    			xpos: 20,
    			ypos: 20,
    			width: 60,
    			height: 10,
    			columns: 3,
    			rows:1,
    			font:"Helvetica",
    			color:"#000000",
    			italic:false,
    			borderexists:true,
    			bordercolor:"#000000",
    			bold:false,
    			background: {
    				image: false,
    				color: "#343533",
    				source: ""
    			}
    		}
    	});
    };
    $scope.currentPreview = null;
    $scope.windowResize = function(){
    	var width = $window.innerWidth;
    	$scope.previewPageWidth = width * .6;
    	$scope.previewPageHeight = width * 0.46329113923;
    	$scope.previewPageMT = ($window.innerHeight - (width * 0.46329113923))/2;
    	$scope.previewPageML = 0.075 * width;
    	$scope.containerHeight = $window.innerHeight - 120;
    }; 
    $scope.savePage = function() {
    	var confirm = $window.confirm("Are you sure you want to save? Make sure your name is unique or it will overwrite similarly named pages.");
    	if (confirm == false) {
    		return;
    	}
    	$http.post('/proposalpage',$scope.pagePreview).success(function(res){
    		$scope.loadPageTypes();
    	//	$scope.$apply();
    	}).error(function() {
    		alert('Error!');
    	});
    };   
    $scope.removeElement = function(elementType,index) {
    	if (elementType=='Heading'){
    		$scope.pagePreview.pagesetup.heading.splice(index,1);
    	}else if (elementType=='Textbody'){
    		$scope.pagePreview.pagesetup.textbody.splice(index,1);
    	}else if (elementType=='etc'){
    		$scope.pagePreview.pagesetup.etc.splice(index,1);
    	}else if (elementType=='Image'){
    		$scope.pagePreview.pagesetup.imagearea.splice(index,1);
    	}
    };
    $scope.removePage = function(pagename) {
    	var confirm = $window.confirm("Are you sure you want to delete this page?.");
    	if (confirm == false) {
    		return;
    	}
    	$http.delete('/proposalpage/'+pagename).success(function(res){
    		$scope.loadPageTypes();
    		$scope.$apply();
    	}).error(function() {
    		alert('Error!');
    	});
    };

}]);

// CREATE CONTROLLER
appCtrl.controller('createController', ['$scope','$rootScope','$http','$document','$window','$location',function($scope,$rootScope,$http,$document,$window,$location) {
	$scope.sortableConfig = {containment: "parent"};
	$scope.proposalList = [];
	$scope.pageTypes = [];
	$scope.showFind = false;
	$scope.wordFind = "";
	$scope.wordReplace = "";
	$scope.page=-1;
	$scope.item=-1;
	$scope.shift=0;
	$scope.disabled = false;
	$scope.beginDots=false;
	$scope.endDots=false;	

    $scope.loadPageTypes = function() {
    	$http.get('/proposalpage').success(function(res){
    		$scope.pageTypes = res;
    	}).error(function(){
    		console.log("There was an error.");
    	});
    };
	if (!$rootScope.email) {
	   // $location.url('/');
	} else {
		$scope.loadPageTypes();
	}
    // setup editor options
    $scope.editorOptions = {
    	language: 'en',
    	uiColor: '#000000'
    };
    $http.get('/proposalList').success(function(res){
    	$scope.proposalList = res;
    }).error(function(){
    	console.log("There was an error.");
    });
    $scope.changeShowFind = function(){
    	$scope.showFind = !$scope.showFind;
    };
    $scope.check = function(item,parent,index){
    	return (item.row===parent) && (item.col===index);
    };
    $scope.propInfo = {
    	user:$,
    	proposalname: $scope.propSaveName,
    	pages: []
    };
    $scope.previewHeight = $window.innerHeight-80;
    $scope.username = $rootScope.user;
    $scope.useremail = $rootScope.email;
    $scope.selectedPage = 0;
    $scope.selectedPageType = 0;
    $scope.range = function(n) { 
    	n=parseInt(n);
    	if (angular.isNumber(n)){
    		if (isNaN(n)){
    			return [];
    		}else{
    			return new Array(parseInt(n));
    		}
    	}else{
    		return [];
    	}
    };
    $scope.nextPage = function(pagesQuantity){
    	if ((pagesQuantity!=0)&&($scope.currentPage+1<pagesQuantity)){
    		$scope.currentPage=($scope.currentPage+1)%pagesQuantity;
    		updateActivePage(pagesQuantity);
    	}
    };
    function updateActivePage(pagesQuantity){
    	console.log("Current:"+$scope.currentPage,"pagesQuantity:"+pagesQuantity,"Shift:"+$scope.shift);
    	if (pagesQuantity>5){
    		if ($scope.currentPage<3){
    			console.log("zona I :inicio");
    			$scope.shift=0;
    		}else if (($scope.currentPage>=3)&&(($scope.currentPage+3)<pagesQuantity)){
    			console.log("zona II : medio");
    			$scope.shift=$scope.currentPage-2;
    		}else{
    			console.log("zona III : final");
    			$scope.shift=pagesQuantity-5;
    		}
    		if ($scope.currentPage>2){
    			$scope.beginDots=true;
    		}else{
    			$scope.beginDots=false;
    		}
    		if ((pagesQuantity-$scope.currentPage)>3){
    			$scope.endDots=true;
    		}else{
    			$scope.endDots=false;
    		}
    	}else{
    		$scope.beginDots=false;
    		$scope.endDots=false;
    	}
    	
    	console.log("current",$scope.currentPage,"total",pagesQuantity,"shift",$scope.shift);
    }
    $scope.previousPage = function(pagesQuantity){
    	if ((pagesQuantity>0)&&($scope.currentPage>0)){
    		$scope.currentPage=($scope.currentPage-1)%pagesQuantity;
    		updateActivePage(pagesQuantity);
    	}
    };
    $scope.increaseRow = function (columns,rows,itemIndex,pageIndex){
    	columns=parseInt(columns);
    	rows=parseInt(rows)+1;
    	if ((rows<1)||(rows>8)){
    		rows=1;
    	}
    	$scope.updateTable(columns,rows,itemIndex,pageIndex);
    	return rows;
    }
    $scope.decreaseRow = function (columns,rows,itemIndex,pageIndex){
    	columns=parseInt(columns);
    	rows=parseInt(rows)-1;
    	if ((rows<1)||(rows>8)){
    		rows=1;
    	}
    	$scope.updateTable(columns,rows,itemIndex,pageIndex);
    	return rows;
    }
    $scope.increaseCol = function (columns,rows,itemIndex,pageIndex){
    	columns=parseInt(columns)+1;
    	rows=parseInt(rows);
    	if ((columns<1)||(columns>8)){
    		columns=1;
    	}
    	$scope.updateTable(columns,rows,itemIndex,pageIndex);
    	return columns;
    }
    $scope.decreaseCol = function (columns,rows,itemIndex,pageIndex){
    	columns=parseInt(columns)-1;
    	rows=parseInt(rows);
    	if ((columns<1)||(columns>8)){
    		columns=1;
    	}
    	$scope.updateTable(columns,rows,itemIndex,pageIndex);
    	return columns;
    }
    $scope.updateTable = function(columns,rows,itemIndex,pageIndex){
    	columns=parseInt(columns);
    	rows=parseInt(rows);
    	if ((columns<1)||(columns>8)){
    		columns=1;
    	}
    	if ((rows<1)||(rows>8)){
    		rows=1;
    	}
    	$scope.propInfo.pages[pageIndex].pagesetup.etc[itemIndex].settings.rows=rows;
    	$scope.propInfo.pages[pageIndex].pagesetup.etc[itemIndex].settings.columns=columns;
    	$scope.propInfo.pages[pageIndex].pagesetup.etc[itemIndex].content=[];
    	for (var i=0;i<rows;i++){
    		for (var j=0;j<columns;j++){
    			var newValue ={
    				"text" : "",
    				"row" : i,
    				"col" : j
    			};
    			$scope.propInfo.pages[pageIndex].pagesetup.etc[itemIndex].content.push(newValue);
    		}
    	}
    };
    $scope.loadPageTypes = function() {
    	$http.get('/proposalpage').success(function(res){
    		$scope.pageTypes = res;
    		$scope.pageNames=[];
    		for (var i=0;i<$scope.pageTypes.length;i++){
    			$scope.pageNames.push($scope.pageTypes[i].typename);
    		}
    	}).error(function(){
    		console.log("There was an error.");
    	});
    };
    $scope.selectPage = function(index) {
    	$scope.selectedPage = index;
    	$scope.currentPage = index;
    	updateActivePage($scope.propInfo.pages.length);
    };
    $scope.addPage = function() {
    	var selectedPage=$scope.pageTypeName;
		if (selectedPage==undefined){
			$scope.pageError="Select a page!";
		}else{
			$scope.pageError="";
		    // add the current page to the list of the display pages on the left
		    $scope.propInfo.pages.splice($scope.currentPage+1,0,selectedPage);
		    $scope.nextPage($scope.propInfo.pages.length);
		}
	};
	$scope.deletePage = function(index) {
		$scope.propInfo.pages.splice(parseInt(index),1);
	};
	$scope.deleteRow = function(parentindex,index) { 
	};
	$scope.addRow = function(index) {
		console.log("meow");
	};
// Generate the PDF Proposal
$scope.genProposal = function() {
    // get current user
    var proposal = $scope.propSaveName;
    var user = $scope.useremail;
    $scope.propInfo.username=user;
   // request the pdf file and sends propInfo as a parameter for its creation
   $scope.propInfo.proposalname=proposal;
   $http.post('/genPDF',$scope.propInfo).success(function(res){
   	$document.find("iframe").attr("src","pdf/" + proposal+ "_" + user +".pdf");
   }).error(function() {
   	alert('Error!');
   });
};
$scope.saveProposal = function() {
	var newProp = true;
	$scope.proposalList.forEach(function(element,index,array) {
		if (element.proposalname === $scope.propSaveName) {
			newProp = false;
		}
	});
	if (newProp === false) {
		var confirm = $window.confirm("This proposal name is already taken, would you like to overwrite it?");
		if (confirm === false) {
			return;
		}
	}

	var propInfo = {
		owner: $scope.useremail,
		proposalname: $scope.propSaveName,
		propinfo: $scope.propInfo
	};
	$http.post('/saveProposal',propInfo).success(function(res){
		$scope.genProposal();
		$scope.saveConfirm = "Proposal Saved.";
		$scope.loadProposal();
		setTimeout(function(){
			$scope.saveConfirm = "";
		}, 2000);
	}).error(function() {
		$scope.saveConfirm = "There was a problem. Please try again.";
		setTimeout(function(){
			$scope.saveConfirm = "";
		}, 2000);
	});
};
$scope.loadProposal = function(){
	$http.get('/proposalList').success(function(res){
		$scope.proposalList = res;
	}).error(function(){
		console.log("There was an error.");
	});
};

$scope.replaceAll = function() {
	var found = $scope.wordFind;
	var replace = $scope.wordReplace;
	var stringified = JSON.stringify($scope.propInfo);
	stringified = stringified.replace(found,replace);
	$scope.propInfo = JSON.parse(stringified);
};
$scope.addPackage = function(pageIndex,etcIndex) {
	console.log(pageIndex,etcIndex);
	$scope.propInfo.pages[pageIndex]
	.pagesetup.etc[etcIndex]
	.settings.pagetext.push({
		pname: "Branding Package",
		pservice: [{text:"Logo"},{text:"Branding Guide"},{text:"Letterhead"},{text:"Business Card Templates"}],
		psub: "$5,000.00",
		ptime: "1 Month"
	});
};
$scope.addSubservice = function(pageIndex,etcIndex,pageTextIndex) {
	$scope.propInfo
		.pages[pageIndex]
			.pagesetup.etc[etcIndex]
				.settings.pagetext[pageTextIndex]
					.pservice.push({text:""});
};
$scope.deletePackage = function(pageIndex,etcIndex,pageTextIndex) {
	$scope.propInfo.pages[pageIndex]
	.pagesetup.etc[etcIndex]
	.settings.pagetext.splice(pageTextIndex,1);
};
$scope.deleteSubservice = function(pageIndex,etcIndex,pageTextIndex,serviceIndex) {
	$scope.propInfo.pages[pageIndex]
	.pagesetup.etc[etcIndex]
	.settings.pagetext[pageTextIndex]
	.pservice.splice(serviceIndex,1);
};
$scope.updateImage = function (item,page,type){
	$scope.item=item;
	$scope.page=page;
	$scope.type=type;
};
$scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
    	url: '/uploadImage',
    	accept: function(file, done) {
    		if (file) {
    			if (this.files[1]!=null){
    				this.removeFile(this.files[0]);
    			}
    			if ($scope.type==="image"){
    				$scope.propInfo
    				.pages[$scope.page]
    				.pagesetup
    				.imagearea[$scope.item]
    				.settings.defaultimage=file.name;
    			}else if ($scope.type==="header"){
    				$scope.propInfo
    				.pages[$scope.page]
    				.pagesetup.header.settings.source=file.name;

    			}else if ($scope.type==="footer"){
    				$scope.propInfo
    				.pages[$scope.page]
    				.pagesetup.footer.settings.source=file.name;
    			}
    		}
    	}
    }
};
}]);

// Menu Controller
appCtrl.controller('hubController', ['$scope',"$http",'$rootScope','$window',function($scope,$http,$rootScope,$window) {
	$scope.pages = [
	{
		name: "Create Proposal",
		url: "/#/create"
	},{
		name: "Edit Page Templates",
		url: "/#/pagebuilder"
	}
	];

	$scope.proposalList = [];
	$scope.loadProposal= function(){
		$http.get('/proposalList').success(function(res){
	    	$scope.proposalList = res;
	    }).error(function(){
	    	console.log("There was an error.");
	    });
	}
    $scope.removeProposal = function(proposalID,name) {
    	var confirm = $window.confirm("Are you sure you want to delete this proposal?.");
    	if (confirm == false) {
    		return;
    	}
    	$scope.url="user";
    	
    	$http.delete('/proposalDelete/'+proposalID+"/"+name).success(function(res){
    		$scope.loadProposal();
    		$scope.$apply();
    		setTimeout(function(){ refreshProposalCanvas('iterate') }, 3000);
    	}).error(function() {
    		alert('Error!');
    	});
    }; 
	$scope.loadinProposal = function(index,propName){
		alert('This is a Free Version!');
	  /*  var confirm = $window.confirm("Loading this proposal will overwrite any changes you might have made. Please press Cancel and save your changes or press OK to continue.");
	    if (confirm == false) {
	      return;
	    }
	    $scope.chosenProposal=index;
	    $scope.propSaveName=propName;
	    $http.post('/proposalLoad',{chosen: index}).success(function(res){
	      $scope.propInfo = res[0].propinfo;
	        $scope.genProposal();
	    }).error(function(){
	      console.log("There was an error.");
	  });*/
	};

function refreshProposalCanvas(pageId){
	var n=1;
	var canvasCollection=new Array("pdf/"+pageId);
	if (pageId==="iterate"){
		canvasCollection=new Array();
		n=0;
		$('canvas').each(function(){
			canvasCollection.push("pdf/"+this.getAttribute('id'));
			n++;
		});
	}
	for (var i=0;i<n;i++){
		var url=canvasCollection[i];
		console.log(url);
		PDFJS.getDocument(url).then(function getFirst(pdf) {
       //
       // Fetch the first page
       //
       pdf.getPage(1).then(function getPageFirst(page) {
       	var scale = 0.05;
       	var viewport = page.getViewport(scale);
             //
             // Prepare canvas using PDF page dimensions
             //
             var canvas = document.getElementById(pageId);
             var context = canvas.getContext('2d');
             canvas.height = viewport.height;
             canvas.width = viewport.width;
             //
             // Render PDF page into canvas context
             //
             page.render({canvasContext: context, viewport: viewport});
         });
   });
	}
}
}]);