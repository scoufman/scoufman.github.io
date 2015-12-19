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
	
	vm.turnTime = 25;		// in ms	
	vm.currentNodeId = 0;
	vm.replaceColor = "#00CC00";
	vm.targetNodeId = 0;
	vm.autoExplore = false;
	
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
			//hierarchical: true
		},
		physics: {
			enabled: true,
			maxVelocity: 35,
			minVelocity: 0.4,
			stabilization: {
				enabled: true,
				iterations: 180, // maximum number of iteration to stabilize
				updateInterval: 10,
				onlyDynamicEdges: false,
				fit: true
	        },
			barnesHut: {
				// gravitationalConstant: -5000,
				// springConstant: 0.04,
				//avoidOverlap: 1,
				// centralGravity: 1.5,
				//springLength: 95,
				// damping: 0.09
			}
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
			randomSeed: vm.dungeonSeed,
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
		console.log('WOW2');
		vm.worldmap.assignNetwork(network);
		//vm.worldmap.networkObj = network;
	}
	vm.worldmapevents.stabilized = function(args) {
		// var iterations = args.iterations;
		// 
		// if (iterations > 1) {
		// 	vm.worldmap.nodes.forEach(function(item) { vm.worldmap.nodes.update({id: item.id, physics:false }); });	
		// 	vm.worldmap.edges.forEach(function(item) { vm.worldmap.edges.update({id: item.id, physics:false }); });
		// }
		//console.log('stabilized after:' + JSON.stringify(args));
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
			
			if (item.id != vm.currentNodeId) {
				console.log('user wants to move to node id ' + item.id);
				vm.targetNodeId = item.id;
			}
		}
	}
		
	vm.img = new Image;
	vm.img.onload = function(){
		//ctx.drawImage(img,0,0); // Or at whatever offset you like
	};
	vm.img.src = "img/player.png";
	
	vm.worldmapevents.afterDrawing = function(canvas) {
		var from = null;
		var to = null;
		
		var res = vm.mapNetwork.getPositions([vm.currentNodeId, vm.nextNodeId]);
		
		if (vm.player.moving == false) {
			from = { x: vm.player.x, y: vm.player.y };
			to = { x: res[vm.currentNodeId].x, y: res[vm.currentNodeId].y };
		}
		else {
			from = { x: res[vm.currentNodeId].x, y: res[vm.currentNodeId].y };
			to = { x: res[vm.nextNodeId].x, y: res[vm.nextNodeId].y };
			
		}
	
		var dist = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
		var dirx = (to.x - from.x) / dist;
		var diry = (to.y - from.y) / dist;
		
		vm.player.x += dirx * (dist / 15);
		vm.player.y += diry * (dist / 15);

		if(Math.sqrt(Math.pow(vm.player.x - from.x, 2) + Math.pow(vm.player.y - from.y, 2)) >= dist) {
			vm.player.moving = false;
			vm.player.reachedNode = true;
			console.log('reached point');
		}

		canvas.drawImage(vm.img, vm.player.x, vm.player.y, 72, 52);
	}
	vm.worldmapevents.oncontext = function(args) {
		console.log('right click');
		args.event.preventDefault();
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
	
	vm.nextNodeId = 0;
	vm.nextPath = null;
	vm.getNextNodes = function() {
		var G = vm.makeTempGraph();
		vm.nextPath = jsnx.shortestPath(G, {source:vm.currentNodeId, target:vm.targetNodeId});
		
		return vm.nextPath;
	}
	
	vm.processTurn = function() {
		vm.turnCount += 1;
		
		if (vm.targetNodeId > 0) {
		
			if (vm.nextNodeId == 0) {
				vm.nextNodeId = vm.getNextNodes()[1];
				console.log('Moving to nodeId:' + vm.nextNodeId + ' from nodeId:' + vm.currentNodeId);
				vm.player.moving = true;
				vm.player.reachedNode = false;
			}

			// force graph to be re-drawn
			vm.worldmap.nodes.update({id:vm.currentNodeId, color:"#FFFF00"});
			
			if (vm.player.reachedNode) {
				
				vm.currentNodeId = vm.nextNodeId;
				
				vm.worldmap.extendNode(vm.currentNodeId);
				
				if (vm.currentNodeId == vm.targetNodeId) {
					vm.targetNodeId = 0;
					vm.player.moving = false;
				}
				vm.nextNodeId = 0;
			}
		}
		else {
			if (vm.autoExplore) {
				var notExtendedNodes = vm.worldmap.nodes.get({
					filter: function (item) {
						return (item.extended == false);
					}
				});
				vm.targetNodeId = notExtendedNodes[0].id;
				vm.nextNodeId = 0;
			}
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
	
		vm.worldmap = mapFact.createMap("World", "Home sweet home");
		
		vm.worldmapdata = {
			"nodes": vm.worldmap.nodes,
			"edges": vm.worldmap.edges			
		};
		
		console.log('WOW1');
		
		vm.dungeon = null;
		
		// TODO fix initial positioning
		vm.currentNodeId = vm.worldmap.nodes.get(2).id;
		console.log(JSON.stringify(vm.worldmap.nodes.get(2)));
		console.log(vm.currentNodeId);
		vm.turnTimer = $interval(function() { vm.processTurn();  }, vm.turnTime);

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
		vm.autoExplore = !vm.autoExplore;
	// 	var nodes = vm.worldmap.nodes.getIds();
	// 	var item = Math.floor(Math.random() * nodes.length - 1);
	// 	if (item < 0)
	// 		item = 0;
	// 	
	// 	vm.worldmap.extendRoom(nodes[item]);
	// 	vm.mapNetwork.fit();
	}
	
	vm.init();
	vm.testStart();
}]);