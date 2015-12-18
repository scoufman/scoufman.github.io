app.factory('mapFact', ['$rootScope', 'NameFact', 'VisDataSet', function($rootScope, NameFact, VisDataSet) {
	var factory = {};

	factory.nameFact = NameFact;

	factory.NODE_TYPE_DUNGEON = 1;
	factory.NODE_TYPE_PATH = 2;
	factory.NODE_TYPE_BUILDING = 3;
	
	factory.NODE_SUBTYPE_CHURCH = 1;
	factory.NODE_SUBTYPE_WINDMILL = 2;
	factory.NODE_SUBTYPE_HOSPITAL = 3;
	factory.NODE_SUBTYPE_WAREHOUSE = 4;
	factory.NODE_SUBTYPE_CASTLE = 5;
	factory.NODE_SUBTYPE_GRAVEYARD = 6;
	factory.NODE_SUBTYPE_PHARMACY = 7;
	factory.NODE_SUBTYPE_TOWNHALL = 8;
	factory.NODE_SUBTYPE_FARM = 9;
	factory.NODE_SUBTYPE_TAVERN = 10;
	
	factory.NODE_SUBTYPE_GRASS = 11;	
	
	factory.NODE_SUBTYPE_HOUSE = 12;
	
	
	factory.nodeSubTypes = {};
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON] = {};
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_CHURCH] = { name:"Church" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_WINDMILL] = { name:"Windmill" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_HOSPITAL] = { name:"Hospital" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_WAREHOUSE] = { name:"Warehouse" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_CASTLE] = { name:"Castle" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_GRAVEYARD] = { name:"Graveyard" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_TOWNHALL] = { name:"Town Hall" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_FARM] = { name:"Farm" };
	factory.nodeSubTypes[factory.NODE_TYPE_DUNGEON][factory.NODE_SUBTYPE_TAVERN] = { name:"Tavern" };
	
	factory.nodeSubTypes[factory.NODE_TYPE_PATH] = {};
	factory.nodeSubTypes[factory.NODE_TYPE_PATH][factory.NODE_SUBTYPE_GRASS] = { name:"Grassy Field", skipPrefix: true };
	
	factory.nodeSubTypes[factory.NODE_TYPE_BUILDING] = {};
	factory.nodeSubTypes[factory.NODE_TYPE_BUILDING][factory.NODE_SUBTYPE_HOUSE] = { name:"House" };
	
	//console.log(JSON.stringify(factory.nodeSubTypes));
	
	factory.nextId = 1;//'aaaaaaaaa';
	
	// factory.getNextId = function() {
	// 	factory.nextId = '' + ((parseInt(factory.nextId, 36)+1).toString(36)).replace(/0/g,'a');
	// 	console.log(factory.nextId);
	// 	return factory.nextId;		
	// }

	factory.getNextId = function() {
		return factory.nextId++;		
	}
	
	factory.dungeonPrefixes = [
		"Dusty", "Ruined", "Crumbled", "Never-ending",
		"Abandoned", "Eternal", "Fabulous", "Atrocious",
		"Spooky", "Scary", "Bloody", "Suspicious"
	];

	factory.getRandomNameForNode = function(type, subtype) {
		var pos = Math.floor((Math.random() * factory.dungeonPrefixes.length) + 1);
		var val = '';
		
		if (factory.nodeSubTypes[type][subtype].skipPrefix === undefined || factory.nodeSubTypes[type][subtype].skipPrefix == false) {
			val += factory.dungeonPrefixes[pos - 1] + ' ';
		}
		
		val += factory.nodeSubTypes[type][subtype].name;

		return val;
	}
	
	factory.createEmptyNode = function() {
		var node = {};
		
		return node;
	}
	
	factory.createNode = function(name, subtype, size, color) {
		var node = {};
		
		node.id = factory.getNextId();
		node.label = name;
		node.shape = "circularImage";
		node.image = factory.getGraphicForNodeSubType(subtype);
		node.size = size;
		node.color = color;
		node.shadow = true;
		node.extended = false;
		node.level = 1;
		
		return node;
	}
	
	//TODO add node type, not just subtype
	factory.images = {};
	factory.images[factory.NODE_SUBTYPE_CHURCH] = [
		"church.png"	
	];
	factory.images[factory.NODE_SUBTYPE_WINDMILL] = [
		"medieval_windmill.png"	
	];
	factory.images[factory.NODE_SUBTYPE_HOSPITAL] = [
		"villa_large.png"	
	];
	factory.images[factory.NODE_SUBTYPE_WAREHOUSE] = [
		"villa.png"	
	];
	factory.images[factory.NODE_SUBTYPE_CASTLE] = [
		"castle_large.png"	
	];
	factory.images[factory.NODE_SUBTYPE_GRAVEYARD] = [
		"tombstone3.png"	
	];
	factory.images[factory.NODE_SUBTYPE_TOWNHALL] = [
		"oldBuilding.png"	
	];
	factory.images[factory.NODE_SUBTYPE_FARM] = [
		"farm.png"	
	];
	factory.images[factory.NODE_SUBTYPE_TAVERN] = [
		"tavern.png"	
	];
	factory.images[factory.NODE_SUBTYPE_GRASS] = [
		"grass_09.png",
		"grass_10.png",
		"grass_11.png",
		"grass_12.png",
		"grass_13.png",
		"grass_14.png",
		"grass_15.png",
		"grass_16.png",
	];
	factory.images[factory.NODE_SUBTYPE_HOUSE] = [
		"modern_houseSmall.png"	
	];
	
	factory.getGraphicForNodeSubType = function(subType) {
		var rand = Math.floor(Math.random() * factory.images[subType].length + 1);
		return "img/" + factory.images[subType][rand - 1]; 
	}
	
	factory.getRandomNodeType = function() {
		var rand = Math.floor(Math.random() * 100);
		
		if (rand >= 0 && rand <= 20)
			return factory.NODE_TYPE_DUNGEON;
		
		return factory.NODE_TYPE_PATH;
	}
	
	factory.getRandomNodeSubType = function(nodeType) {
		var keys = Object.keys(factory.nodeSubTypes[nodeType]);
		var pos = Math.floor(Math.random() * keys.length);
		return keys[pos];
	}
	
	factory.createRandomNode = function() {
		var node = {};
		
		var type = factory.getRandomNodeType();
		var subtype = factory.getRandomNodeSubType(type);

		node.id = factory.getNextId();
		node.label = factory.getRandomNameForNode(type, subtype);
		node.extended = false;
		node.shadow = true;
		node.color = "#FF0000";		
		node.shape = "circularImage";
		node.image = factory.getGraphicForNodeSubType(subtype);
		node.level = 1;
			
		if (type == factory.NODE_TYPE_DUNGEON) {
			node.size = 50;
		}
		else if (type == factory.NODE_TYPE_PATH) {
			node.size = 25;
		}
		
		return node;
	}
	
	factory.createMap = function(name, firstNodeName) {
		var map = {};
		
		map.assignNetwork = function(networkObj) {
			console.log('Assigning network to map');
			map.mapNetwork = networkObj;	
		}		
		
		map.addEdge = function(sourceNodeId, destNodeId) {
			// TODO: add checks if already existing			
			map.edges.add({
				from: sourceNodeId,
				to: destNodeId,
				length:Math.floor(Math.random() * 150 + 175),
				dashes: false,
			});
		}
		
		map.id = factory.getNextId();
		map.name = name;
		
		map.edges = new VisDataSet();
		
		map.extendNode = function(nodeId) {
			var node = map.nodes.get(nodeId);
			
			if (node.extended)
				return;
			
			var newNodes = Math.random() * 3;			

			map.nodes.update({id:nodeId, size:node.size + newNodes * 5, extended: true});

			var spawnPos = null;

			if (map.mapNetwork !== undefined)
				spawnPos = map.mapNetwork.getPositions(node.id);
			
			console.log('spawn:'+JSON.stringify(spawnPos));
			
			for (var i = 0; i <= newNodes; ++i) {
				var newNode = factory.createRandomNode();
				
				if (spawnPos != null) {
					newNode.x = spawnPos[node.id].x;
					newNode.y = spawnPos[node.id].y;
				}
				
				console.log('creating node at (x, y):(' + node.x + ', ' + node.y +')');
				map.nodes.add(newNode);
				
				map.addEdge(nodeId, newNode.id);
			}
		}
		
		map.nodes = new VisDataSet();
		
		var node = factory.createNode(firstNodeName, factory.NODE_SUBTYPE_HOUSE, 40, "#FFFF00")
		map.nodes.add(node);
		map.extendNode(node.id);
				
		return map;
	}

	return factory;	
}]);