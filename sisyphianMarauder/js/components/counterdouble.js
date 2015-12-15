app.component('counterdouble', {
	bindings: {
		name: '@',
		currentcount: '=',
		maxcount: '=',
		namecss: '@',
		countcss: '@'
	},
	controller: function() {
		
	},
	templateUrl: "templates/counterdouble.html"
});