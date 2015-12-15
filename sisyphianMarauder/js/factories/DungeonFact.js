app.factory('DungeonFact', ['$rootScope', 'StatsFact', 'NameFact', 'MobFact', function($rootScope, StatsFact, NameFact, MobFact) {
	var factory = {};
	
	factory.statsFact = StatsFact;
	factory.nameFact = NameFact;
	factory.mobFact = MobFact;

	// TODO: Move to a name factory
	factory.getRandomDungeonName = function() {
		var n1 = ["Dusty", "Ruined", "Crumbled", "Never-ending", "Abandoned", "Eternal", "Fabulous", "Atrocious", "Spooky", "Scary", "Bloody", "Suspicious"];
		var n2 = ["Church of Cthulhu", "Hospital", "Warehouse", "Castle", "Graveyard", "Pharmacy", "Town Hall", "Mall"];
		
		return n1[Math.floor((Math.random() * n1.length))] + ' ' + n2[Math.floor((Math.random() * n2.length))];
	}
	
	factory.createDungeonRoom = function(orderNumber) {
		var dungeonRoom = {};
		
		dungeonRoom.mobs = [];
		
		var mobCount = 5;//Math.random() * 5 + 1;
		for (var i = 0; i < mobCount; ++i) {
			var mob = factory.mobFact.createMob();
			dungeonRoom.mobs.push(mob);
		}
		
		dungeonRoom.orderNumber = orderNumber;
		
		return dungeonRoom;
	}
	
	factory.createDungeon = function() {
		var dungeon = {};
		
		// Check for null on return, dungeon could be cleared
		dungeon.getNextRoom = function() {
			if (dungeon.exploredRooms < dungeon.roomCount)
				return dungeon.rooms[dungeon.exploredRooms];
				
			return null;
		}
		
		dungeon.name = factory.nameFact.getRandomDungeonName();		
		dungeon.exploredRooms = 0;
		dungeon.roomCount = 5;
		dungeon.rooms = [];
		
		for (var i = 0; i < dungeon.roomCount; ++i) {
			dungeon.rooms.push(factory.createDungeonRoom(i));
		}
		
		return dungeon;		
	}
	
	return factory;	
}]);