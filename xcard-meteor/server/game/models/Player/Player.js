// Player.js: Defines a default player object
Player = function(id, gameId) {
  this.playerId = id;
  this.playerName = UserCollection.findOne(this.playerId).username;
  this.deck = null;
  this.hand = null;
  this.discard = [];
  this.exile = [];
  this.battlefield = [];
  this.health = 20;
  this.maxMana = 0;
  this.mana = 0;
}
