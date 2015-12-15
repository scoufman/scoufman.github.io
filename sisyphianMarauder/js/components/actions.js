app.component('actions', {
	bindings: {
		kernel: '='
	},
	controller: function() {
		var vm = this;
		var kernel = vm.kernel;
		var player = vm.kernel.player;
		 
		vm.enterDungeon = function() {
			if (kernel.canMakeDungeon)
				kernel.createNewDungeon();
		}

		vm.exitDungeon = function() {
//			console.log(kernel.getCurrentTimestamp() + ' - kernel.canClearDungeon:' + kernel.canClearDungeon);
			if (kernel.canClearDungeon) {
				player.isInsideDungeon = false;
			}
		}
	},
	templateUrl: "templates/actions.html"
});