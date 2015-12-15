app.component('playerinfo', {
	bindings: {
		obj: '=',
		expfunc: '&'
	},
	controller: function() {
 		this.LevelUp = function() { this.obj.level += 1; }
		this.LevelDown = function() { if (this.obj.level > 1) this.obj.level -= 1; }
		this.ExpUp = function() { (this.obj.experience += Math.floor(this.expfunc()(this.obj.level) / 10)); } 
	},
	templateUrl: "templates/playerInfo.html"
});