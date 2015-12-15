app.factory('mapFact', ['$rootScope', 'NameFact', 'VisDataSet', function($rootScope, NameFact, VisDataSet) {
	var factory = {};

	factory.nameFact = NameFact;
	
	factory.nextId = 1;//'aaaaaaaaa';
	
	// factory.getNextId = function() {
	// 	factory.nextId = '' + ((parseInt(factory.nextId, 36)+1).toString(36)).replace(/0/g,'a');
	// 	console.log(factory.nextId);
	// 	return factory.nextId;		
	// }

	factory.getNextId = function() {
		return factory.nextId++;		
	}
	
	factory.createRoom = function(name, shape, size, color) {
		var room = {};
		
		room.id = factory.getNextId();
		room.label = name;
		room.shape = shape;
		room.size = size;
		room.color = color;
		room.shadow = true;
		room.extended = false;
		
		return room;
	}
	
	factory.createRandomRoom = function() {
		var room = {};
		
		var rand = Math.floor(Math.random() * 100 + 1);
		
		if (rand > 0 && rand < 16) {
			room.label = factory.nameFact.getRandomDungeonName();
			room.shape = "star"
			room.color = "#FF0000";
			room.size = 25;
		}
		else if (rand > 15) {
			room.label = factory.nameFact.getRandomPathName();
			room.shape = "dot";
			room.color = "#FFCC00";
			room.size = 10;
		}
		
		room.extended = false;
		room.id = factory.getNextId();
		room.shadow = true;
		
		return room;
	}
	
	factory.createMap = function(name, firstRoomName) {
		var map = {};
		
		map.addEdge = function(sourceRoomId, destRoomId) {
			// TODO: add checks if already existing			
			map.edges.add({from: sourceRoomId, to: destRoomId, length:Math.random() * 350 + 25});
		}
		
		map.id = factory.getNextId();
		map.name = name;
		
		map.edges = new VisDataSet();
		
		map.extendRoom = function(roomId) {
			var room = map.nodes.get(roomId);
			
			if (room.extended)
				return;
			
			var newRooms = Math.random() * 3;			

			map.nodes.update({id:roomId, size:room.size + newRooms * 5, extended: true});

			for (var i = 0; i <= newRooms; ++i) {
				var newRoom = factory.createRandomRoom();
				
				map.nodes.add(newRoom);
				
				map.addEdge(roomId, newRoom.id);
			}
		}
		
		map.nodes = new VisDataSet();
		
		room = factory.createRoom(firstRoomName, "square", 10, "#FFFF00")
		map.nodes.add(room);
		map.extendRoom(room.id);
		//console.log('yyy:' + JSON.stringify(map.nodes));
		return map;
	}

	return factory;	
}]);