app.factory('NameFact', ['$rootScope', function($rootScope) {
	var factory = {};
	
	factory.pathNames = ["wooden bridge", "muddy road", "dark path"];

	factory.dungeonPrefixes = ["Dusty", "Ruined", "Crumbled", "Never-ending", "Abandoned", "Eternal", "Fabulous", "Atrocious", "Spooky", "Scary", "Bloody", "Suspicious"];
	factory.dungeonNames = ["Church of Cthulhu", "Hospital", "Warehouse", "Castle", "Graveyard", "Pharmacy", "Town Hall", "Farm", "Windmill", "Tavern"];

	factory.getRandomDungeonName = function() {
		
		return factory.dungeonPrefixes[Math.floor((Math.random() * factory.dungeonPrefixes.length))]
				+ ' '
				+ factory.dungeonNames[Math.floor((Math.random() * factory.dungeonNames.length))];
	}
	
	factory.getRandomPathName = function() {
		return factory.pathNames[Math.floor((Math.random() * factory.pathNames.length))];
	}
	
	return factory;	
}]);