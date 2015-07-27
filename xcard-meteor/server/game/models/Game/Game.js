// Game: Responsible for holding game state and common game function
var get = function( obj, k, def ) {
  if( obj[k] ) {
    return obj[k];
  }
  return def;
}

Game = function(raw) {

  this.creator = get(raw, "creator");
  this.playersMap = get(raw, "playersMap", {});
  this.players = get(raw, "players", {});
  this.options = get(raw, "options", {});
  this.state = get(raw, "state", { current: "init", activePlayer: 1, totalPlayers: 0 });
  this.messages = get(raw, "messages", []);
  this.targets = {};
}
