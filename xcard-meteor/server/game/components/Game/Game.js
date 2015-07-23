// Game: Responsible for holding game state and common game function

var get = function( obj, k, def ) {
  if( obj[k] ) {
    return obj[k];
  }
  return def;
}

var nextId = function(id, maxPlayers) {
  return (id+1>maxPlayers) ? 1 : id+1;
}

var playerCanPerformActions = function(player) {
  return (!_.isUndefined(player)) && player.health >= 0 && ( player.deck.length > 0 || player.hand.length > 0 );
}

Game = function(raw) {

  this.creator = get(raw, "creator");
  this.playersMap = get(raw, "playersMap", {});
  this.players = get(raw, "players", {});
  this.options = get(raw, "options", {});
  this.state = get(raw, "state", { current: "init", activePlayer: 1, totalPlayers: 0, nextPlayerId: 1 });
  this.messages = get(raw, "messages", []);

  this._initPlayers(get(raw, "initPlayers", []));
}

Game.prototype._initPlayers = function(players) {
  if( players.length ) {
    _.each(players, function(playerId) {
      this.addPlayer( playerId );
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

Game.prototype.setNextActivePlayer = function() {
  // Produce an array of all playerIds to make sure if all players are checked and
  // we cannot find a valid active player we exit the loop
  var playerAttemptedIds = _.map( this.players, function(ele) {
    return ele.playerId;
  });

  do {
    this.state.activePlayer = nextId( this.state.activePlayer, this.state.nextPlayerId-1 );
    var player = this.players[this.state.activePlayer];
    if( player ) {
      playerAttemptedIds.pop( playerAttemptedIds.indexOf( player.playerId ) );
    }
    // If the player cannot perform actions and we have players left to check
    // then repeat the selection process
  } while( !playerCanPerformActions(player) && playerAttemptedIds.length > 0 );

}

Game.prototype.addPlayer = function(playerId) {
  if( _.isUndefined( this.playersMap[playerId] ) ) {
    var playerGameId = (this.state.nextPlayerId++);
    this.state.totalPlayers++;
    this.playersMap[playerId] = playerGameId;
    this.players[playerGameId] = new Player( playerId, playerGameId );
    this.addGlobalGameMessage( UserCollection.findOne(playerId).username + " has joined the game." );
    return true;
  }
}

Game.prototype.removePlayer = function(playerId) {
  if( !_.isUndefined( this.playersMap[playerId] ) ) {
      this.state.totalPlayers--;
      delete this.players[this.playersMap[playerId]];
      delete this.playersMap[playerId];
      this.addGlobalGameMessage( UserCollection.findOne(playerId).username + " has left the game." );
      return true;
  }
}
