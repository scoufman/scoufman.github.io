app.factory('StatsFact', ['$rootScope', function($rootScope) {
	var factory = {};
	
	factory.BASE_VITALITY_MULTIPLIER = 2;
	
	factory.EXP_CONSTANT = 0.150;
	
	factory.getExpForLevel = function(level) {
		//return (level * level) / factory.EXP_CONSTANT;
		return Math.floor(Math.pow(level / factory.EXP_CONSTANT, 2));		
	}
	
	factory.calculateExpFromKill = function(winnerMob, loserMob) {
		//var levelExp = factory.getExpForLevel(winnerMob);
		var levelDiff = loserMob.level - winnerMob.level;
		var multiplier = 1 + (levelDiff * 0.1);
		
		if (multiplier < 0.1)
			return 0;

		return Math.floor((2 + 3 * loserMob.level) * multiplier);
	}
	
	return factory;
}]);