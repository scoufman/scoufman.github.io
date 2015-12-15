app.factory('MobFact', ['$rootScope', 'StatsFact', function($rootScope, StatsFact) {
	var factory = {};
	
	var ITEMSLOT_WEAPON1 = 0;
	
	factory.statsFact = StatsFact;
	
	factory.createMob = function() {
		var mob = {};
		
		mob.lastActionTurn = 0;
		
		mob.canAttack = function() {
			var aps = mob.calculateAPS();
			var now = new Date();
			
			return ((now - mob.lastMeleeAttackTimestamp) / 1000 > (1 / aps));
		}
		
		mob.calculateMaxHealth = function() {
			return mob.vitality
					* factory.statsFact.BASE_VITALITY_MULTIPLIER;
		}
		
		mob.calculateMeleeDamage = function() {
			if (mob.itemSlots[ITEMSLOT_WEAPON1] == null) {
				return Math.floor(mob.strength / 2 + 1);
			}
		}
		
		mob.attackMelee = function(otherMob) {
			var dmg = mob.calculateMeleeDamage();
			
			otherMob.health -= dmg;
			
			mob.lastMeleeAttackTimestamp = new Date();
			
			return dmg;
		}
		
		mob.calculateAPS = function() {
			if (mob.itemSlots[ITEMSLOT_WEAPON1] == null) {
				return 0.5;
			}
			
			return 999;
		}
		
		// Call only if exp requirements have been met
		mob.levelUp = function() {
			mob.experience = mob.experience - factory.statsFact.getExpForLevel(mob.level);
			mob.level += 1;
		}
		
		mob.name = "Dummy1";
		
		mob.level = 1;
		mob.experience = 0;
		mob.mana = 5;
		mob.maxMana = 5;	
		mob.strength = 5;
		mob.vitality = 6;
		
		mob.maxHealth = mob.calculateMaxHealth();
		mob.health = mob.calculateMaxHealth();
		
		mob.isInsideDungeon = false;
		
		mob.itemSlots = {
			"weapon": null
		};
		
		mob.lastMeleeAttackTimestamp = new Date();
		
		return mob;
	}
	
	return factory;	
}]);