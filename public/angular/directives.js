'use strict';
var app = angular.module('app');
/* Directives */
app.directive('dropzone', function () {

	return function (scope, element, attrs) {
		var config, dropzone;
		config = scope[attrs.dropzone];
    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);  
};
});

app.directive('pageElement', ['$document', function($document) {
	return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			var section = elm.attr("page-element");
			elm.resizable({
				autoHide: true, 
				handles: "e,s,se"
			});
			elm.on('resizestop',function(event, ui){
				var newheight = Math.floor((ui.size.height / scope.previewPageHeight) * 100);
				var newwidth = Math.floor((ui.size.width / scope.previewPageWidth) * 100);
				
				if (isNaN(scope.$eval(attrs.index))) {
					var posleft = "scope.pagePreview.pagesetup." + section + ".settings.xpos";
					var postop = "scope.pagePreview.pagesetup." + section + ".settings.ypos";
				} else {
					var index = scope.$eval(attrs.index);
					var posleft = "scope.pagePreview.pagesetup." + section + "[" + index + "]" + ".settings.xpos";
					var postop = "scope.pagePreview.pagesetup." + section + "[" + index + "]" + ".settings.ypos";
				}
				
				if (newheight+eval(postop) > 100) {
					newheight = 100-eval(postop);
				}
				if (newwidth+eval(posleft) > 100) {
					newwidth = 100-eval(posleft);
				}

				if (isNaN(scope.$eval(attrs.index))) {
					var yfix = "scope.pagePreview.pagesetup." + section + ".settings.height = " + newheight;
					var xfix = "scope.pagePreview.pagesetup." + section + ".settings.width = " + newwidth;
				} else {
					var yfix = "scope.pagePreview.pagesetup." + section + "[" + index + "]" + ".settings.height = " + newheight;
					var xfix = "scope.pagePreview.pagesetup." + section + "[" + index + "]" + ".settings.width = " + newwidth;
				}
				eval(yfix);
				eval(xfix);
				scope.$apply();
			});

elm.draggable({
	containment: elm.parent().parent()
});
elm.on('dragstop', function(event, ui){
	var newtop = Math.floor(((ui.position.top-180) / scope.previewPageHeight) * 100);
	var newleft = Math.floor(((ui.position.left-scope.marginObject )/ scope.previewPageWidth) * 100);
	if (isNaN(scope.$eval(attrs.index))) {
		var yfix = "scope.pagePreview.pagesetup." + section + ".settings.ypos = " + newtop;
		var xfix = "scope.pagePreview.pagesetup." + section + ".settings.xpos = " + newleft;
	} else {
		var index = scope.$eval(attrs.index);
		var yfix = "scope.pagePreview.pagesetup." + section + "[" + index + "]" + ".settings.ypos = " + newtop;
		var xfix = "scope.pagePreview.pagesetup." + section + "[" + index + "]" + ".settings.xpos = " + newleft;
	}
	eval(yfix);
	eval(xfix);
	scope.$apply();
});
}
}
}]);

app.directive('listSortable', function(){
	return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			var options = scope.$eval(attrs.listSortable);
			elm.sortable(options);
		}
	}
});


app.directive('uiColorpicker', function() {
	return {
		restrict: 'E',
		require: 'ngModel',
		scope: false,
		replace: true,
		template: "<span><input class='input-small' /></span>",
		link: function(scope, element, attrs, ngModel) {
			var input = element.find('input');
			var options = angular.extend({
				color: ngModel.$viewValue,
				change: function(color) {
					scope.$apply(function() {
						ngModel.$setViewValue(color.toHexString());
					});
				}
			}, scope.$eval(attrs.options));
			ngModel.$render = function() {
				input.spectrum('set', ngModel.$viewValue || '');
			};

			input.spectrum(options);
		}
	};
});
app.directive('proposalDirective',function($rootScope){
	return{
		restrict: 'A',
		link:function(scope,elem,attrs){
			var url="pdf/"+attrs.proposalDirective;
			PDFJS.getDocument(url).then(function getFirst(pdf) {
				pdf.getPage(1).then(function getPageFirst(page) {
					var scale = 0.5;
					var viewport = page.getViewport(scale);
					var canvas = document.getElementById(attrs.proposalDirective);
					var context = canvas.getContext('2d');
					canvas.height = viewport.height;
					canvas.width = viewport.width;
					page.render({canvasContext: context, viewport: viewport});
					$rootScope.canvasHeight=elem.find("canvas").height();
					$rootScope.$apply();
				});
			});
		}
	}
});