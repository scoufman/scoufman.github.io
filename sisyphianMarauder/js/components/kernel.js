app.component('kernel', {
	bindings: {
		debug: '@'
	},
	scope: {},
	controller: 'kernelCtrl as vm',
	templateUrl: "templates/kernel.html"
})
.controller('kernelCtrl', ['$scope', '$interval', 'toasty', 'MobFact', 'DungeonFact', 'StatsFact', 'VisDataSet', 'mapFact',
function($scope, $interval, toasty, MobFact, DungeonFact, StatsFact, VisDataSet, mapFact) {	
	
	var vm = this;
	
	vm.currentRoomId = 0;
	vm.replaceColor = "#00CC00";
	vm.targetRoomId = 0;
	
	vm.worldSeed = 16666;
	vm.dungeonSeed = 666;
	
	vm.worldmapoptions = {
		autoResize: true,
		height: '550px',
		width: '100%',
		interaction: {
			dragNodes: true
		},
		layout: {
			// randomSeed: vm.worldSeed
		}
	};
	
	vm.dungeonmapdata = {
		"nodes": [{
			"id": "d1_1_1",
			"label": "Stairs from above",
			"size": 10,
			"color": "#00CC00",
			"shape": "diamond",
			"shadow": true
		}, {
			"id": "d1_1_2",
			"label": "Moldy room",
			"size": 5,
			"color": "#FF0000",
			"shape": "dot",
			"shadow": true
		}],
		"edges": [
			{ from: "d1_1_1", to:"d1_1_2", label:"" }
		]
	};
	
	vm.dungeonmapoptions = {
		autoResize: true,
		height: '350px',
		width: '100%',
		interaction: {
			dragNodes: true,
			//  navigationButtons: true
		},
		layout: {
			randomSeed: vm.dungeonSeed
		},
		physics: {
			stabilization: {
				enabled: true,
				iterations: 180, // maximum number of iteration to stabilize
				updateInterval: 10,
				onlyDynamicEdges: false,
				fit: true
	        }
		}	
    };
	
	vm.findNode = function(data, nodeId) {
		for (var i in data.nodes) {
			if (data.nodes[i].id == nodeId)
				return data.nodes[i];
		}
		
		return null;
	}
	
	vm.pathFromNodeToNode = function(nodeA, nodeB) {
		
	}
	
	vm.worldmapevents = {};
	vm.worldmapevents.onload = function(network) {
		console.log('got map network obj');
		vm.mapNetwork = network;
	}
	// vm.worldmapevents.click = function(args) {
	// 	console.log('click');
	// 	for (var key in args.nodes) {
	// 		var node = vm.findNode(vm.worldmapdata, args.nodes[key]);
	// 		
	// 		if (node != null)
	// 			console.log(node.label);
	// 	}
	// }
	vm.worldmapevents.doubleClick = function(args) {
		console.log('double click');
		for (var key in args.nodes) {
			var item = vm.worldmap.nodes.get(args.nodes[key]);
			console.log('user wants to move to node id ' + item.id);
			if (item.id != vm.currentRoomId) {
				vm.targetRoomId = item.id;
			}
		}
	}
	// vm.worldmapevents.selectNode = function (args) {
    //      console.warn('Event "selectNode" triggered - ' + JSON.stringify(args));
    //      console.log.apply(console, args);
    // };
	
	vm.dungeonNetwork = null;
	vm.dungeonmapevents = {};
	vm.dungeonmapevents.onload = function(network) {
		console.log('got dungeon network obj');
		vm.dungeonNetwork = network;
		//vm.dungeonNetwork.fit();
	}
	vm.dungeonmapevents.click = function(args) {
		//console.log('click - ' + JSON.stringify(args));
		for (var key in args.nodes) {
			var node = vm.findNode(args.nodes[key]);
			
			if (node != null)
				console.log(node.label);
		}
	}
	vm.dungeonmapevents.selectNode = function (args) {
         console.warn('Event "selectNode" triggered - ' + JSON.stringify(args));
         console.log.apply(console, args);
    };
	
	vm.fitDungeonNetwork = function() {
		console.log('dungeon network fit');
		vm.dungeonNetwork.fit();
	}
	
	vm.debug = (vm.debug == "true");

	console.log(vm.debug === true ? "Started in debug mode" : "Running without debug");
	
	vm.init = function() {

		vm.datetimeFmt = 'HH:mm:ss';
		
		vm.MAX_COMBAT_ENTRIES = 3;
		vm.MAX_GENERAL_ENTRIES = 3;
	
		vm.combatEntries = [];
		vm.generalEntries = [];
		
		vm.turnCount = 0;
		
		vm.mobsFact = MobFact;
		vm.dungeonFact = DungeonFact;
		vm.statsFact = StatsFact;
		vm.mapFact = mapFact;
		
		vm.canMakeDungeon = true;
		vm.canClearDungeon = false;
	}
	
	vm.getCurrentTimestamp = function() {
		return moment().format(vm.datetimeFmt);
	}
	
	vm.addCombatEntry = function(msg) {
		if (vm.combatEntries.length > this.MAX_COMBAT_ENTRIES)
			vm.combatEntries.shift();
				
		vm.combatEntries.push({timestamp:vm.getCurrentTimestamp(), message:msg});
	}

	vm.addGeneralEntry = function(msg) {
		if (vm.generalEntries.length > this.MAX_GENERAL_ENTRIES)
			vm.generalEntries.shift();
				
		vm.generalEntries.push({timestamp:vm.getCurrentTimestamp(), message:msg});
	}
	
	vm.processCombat = function() {
		if (vm.player.isInsideDungeon) {
			var room = vm.dungeon.getNextRoom();
			
			if (room != null) {
				var mob = room.mobs[0];
				
				if (vm.player.canAttack() && room.mobs.length > 0) {
					var dmgDone = vm.player.attackMelee(mob);
					
					vm.addCombatEntry(vm.player.name + ' attacked ' + mob.name + ' for ' + dmgDone + " damage.");
					
					if (mob.health < 1) {
						vm.addCombatEntry(mob.name + ' has died!');
						
						var exp = vm.statsFact.calculateExpFromKill(vm.player, mob);
						
						vm.addGeneralEntry("You've earned " + exp + " experience.");
						
						vm.player.experience += exp;
						
						room.mobs.shift();
					}
				}
			}			
		}
	}
	
	vm.lastMoveTimestamp = new Date();
	
	vm.processTurn = function() {
		vm.turnCount += 1;
		
		if (vm.targetRoomId > 0) {
			var dt = new Date();
			
			console.log((dt - vm.lastMoveTimestamp) / 1000);
			if ((dt - vm.lastMoveTimestamp) / 1000 > 0.5) {
				//console.log('move now');
				//console.log('calculate next node');
				var G = vm.makeTempGraph();
				var t = jsnx.shortestPath(G, {source:vm.currentRoomId, target:vm.targetRoomId});
				//console.log(t);
				vm.lastMoveTimestamp = dt;
				
				vm.worldmap.nodes.update({id:vm.currentRoomId, color:vm.replaceColor});
				
				vm.currentRoomId = t[1];
				
				vm.worldmap.nodes.update({id:vm.currentRoomId, color:"#FFFF00"});
				
				vm.worldmap.extendRoom(vm.currentRoomId);
				
				if (vm.currentRoomId == vm.targetRoomId)
					vm.targetRoomId = 0;
			}
		}
		
		if (vm.turnCount % 1200 == 0) {
			if (vm.turnCount - vm.player.lastActionTurn >= 40)
				vm.addGeneralEntry("You whisper: Maybe I should search around a bit.");
		}
		
		vm.processCombat();
		
		if (vm.player.experience >= vm.statsFact.getExpForLevel(vm.player.level)) {
			vm.player.levelUp();
			toasty.success('Leveled up!');
		}
	}
	
	vm.createNewDungeon = function() {
		if (vm.player.isInsideDungeon)
			return;
		
		vm.player.isInsideDungeon = true;
		vm.canMakeDungeon = false;
		
		vm.dungeon = vm.dungeonFact.createDungeon();
		
		vm.player.lastActionTurn = vm.turnCount;
		vm.addGeneralEntry("You've entered the " + vm.dungeon.name + ".");
	}
	
	vm.clearCurrentDungeon = function() {
		if (vm.dungeon == null)
			return;
		
		vm.player.isInsideDungeon = false;
		vm.canMakeDungeon = true;
		vm.canClearDungeon = false;		
		
		vm.player.lastActionTurn = vm.turnCount;
		vm.addGeneralEntry("You've exited the " + vm.dungeon.name + ".");
		vm.dungeon = null;
	}
	
	vm.testStart = function() {
	 	vm.player = vm.mobsFact.createMob();
		vm.player.name = "Hulk";
	
		vm.worldmap = mapFact.createMap("World", "Dank cave");
		
		vm.worldmapdata = {
			"nodes": vm.worldmap.nodes,
			"edges": vm.worldmap.edges			
		};
		
		vm.dungeon = null;
		
		// TODO fix initial positioning
		vm.currentRoomId = vm.worldmap.nodes.get(2).id;
		console.log(JSON.stringify(vm.worldmap.nodes.get(2)));
		console.log(vm.currentRoomId);
		vm.turnTimer = $interval(function() { vm.processTurn();  }, 250);

		toasty.success('woop woop');
	}
	
	vm.makeTempGraph = function() {
		var nodeList = vm.worldmap.nodes.getIds();
				
		var G = new jsnx.Graph();

		var tempNodes = []
		for (var n in nodeList) {
			G.addNode(nodeList[n]);
			tempNodes.push(nodeList[n]);			
		}
		
		for (var i in tempNodes) {
			var nodeId = tempNodes[i];
			
			var edgeList = vm.worldmap.edges.get({
				filter: function (item) {
					return (item.from == nodeId);
				}
			});
			
			for (var edge in edgeList) {
				G.addEdge(nodeId, edgeList[edge].to);
			}
		}
		
		return G;
	}
	
	vm.t = function() {
		var nodes = vm.worldmap.nodes.getIds();
		var item = Math.floor(Math.random() * nodes.length - 1);
		if (item < 0)
			item = 0;
		
		vm.worldmap.extendRoom(nodes[item]);
		vm.mapNetwork.fit();
	}
	
	vm.init();
	vm.testStart();
}]);