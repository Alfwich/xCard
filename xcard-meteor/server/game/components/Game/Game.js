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
  this.state = get(raw, "state", { current: "init", activePlayer: 1 });
  this.messages = get(raw, "messages", []);

  this._initPlayers(get(raw, "initPlayers", []));
}

Game.prototype._initPlayers = function(players) {
  if( players.length ) {
    var playerGameId = 1;
    this.state.totalPlayers = players.length;
    _.each(players, function(playerId) {
      this.playersMap[playerId] = playerGameId;
      this.players[playerGameId++] = new Player( playerId, playerGameId );
      this.addGlobalGameMessage( UserCollection.findOne(playerId).username + " has joined the game." );
    }.bind(this));
  }
}

Game.prototype.addGlobalGameMessage = function(msg) {
  this.messages.push( msg );
}

Game.prototype.addSystemMessage = function(msg) {
  this.addGlobalGameMessage( "###SYSTEM: " + msg );
}

Game.prototype.modifyPlayerValue = function( playerGameId, attr, delta ) {
  var player = this.players[playerGameId];

  if( player && player[attr] ) {
    this.addGlobalGameMessage( player.playerName + (delta>0?" gained ":" lost ") + Math.abs(delta) + " " + attr );
    player[attr] += delta;
  }
}

Game.prototype.activePlayerDrawCard = function() {
  // Draw a single card from the players deck and place in hand
  var activePlayer = this.players[this.state.activePlayer];
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    this.addGlobalGameMessage( activePlayer.playerName + " drew a card from their library" );
    activePlayer.hand.push( card );
  }
}




