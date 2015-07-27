// Defines global methods for game actions.

GameState.addGlobalMethod( "addGameMessage", function( action, msg ) {
  action.game.messages.push( msg );
  return true;
});

GameState.addGlobalMethod( "addGameSystemMessage", function( action, msg ) {
  return this.state.callMethod( "addGameMessage", action, "###SYSTEM: " + msg );
});

GameState.addGlobalMethod( "modifyGamePlayerValue", function( action, playerId, attr, delta ) {
  var player = action.game.players[playerGameId];

  if( player && player[attr] ) {
    this.state.callMethod( "addGlobalGameMessage", action, ( player.playerName + (delta>0?" gained ":" lost ") + Math.abs(delta) + " " + attr ) );
    player[attr] += delta;
    return true;
  }
});

GameState.addGlobalMethod( "activePlayerDrawCard", function( action ) {
  // Draw a single card from the players deck and place in hand
  var activePlayer = action.game.players[action.game.state.activePlayer];
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    activePlayer.hand.push( card );
  }
});

var playerCanPerformActions = function(player) {
  return (!_.isUndefined(player)) && player.health >= 0 && ( player.deck.length > 0 || player.hand.length > 0 );
}

GameState.addGlobalMethod( "setNextActivePlayer", function( action ) {

  // Produce an array of all playerIds to make sure if all players are checked and
  // we cannot find a valid active player we exit the loop
  var playerAttemptedIds = _.map( action.game.players, function(ele) {
    return ele.playerId;
  });

  do {
    action.game.state.activePlayer = nextId( action.game.state.activePlayer, action.game.state.totalPlayers );
    var player = action.game.players[action.game.state.activePlayer];
    if( player ) {
      playerAttemptedIds.pop( playerAttemptedIds.indexOf( player.playerId ) );
    }
    // If the player cannot perform actions and we have players left to check
    // then repeat the selection process
  } while( !playerCanPerformActions(player) && playerAttemptedIds.length > 0 );

  return this.state.callMethod( "getActivePlayer" );
});

GameState.addGlobalMethod( "restartGame", function(action) {
  _.forEach( action.game.players, function(player) {
    this.state.callMethod( "removeGamePlayer", action, player.playerId );
    this.state.callMethod( "addGamePlayer", action, player.playerId );
  }.bind(this));

  action.game.state.activePlayer = 1;
  action.game.messages = [];
});

var nextInsertPlayerId = function(players) {
  var result = 1;
  while( !_.isUndefined(players[result])){ result++; }
  return result;
}

GameState.addGlobalMethod( "addGamePlayer", function( action, playerId ){
  if( _.isUndefined( action.game.playersMap[playerId] ) ) {
    var playerGameId = nextPlayerId(action.game.players);
    action.game.state.totalPlayers++;
    action.game.playersMap[playerId] = playerGameId;
    action.game.players[playerGameId] = new Player( playerId, playerGameId );
    return true;
  }
});

GameState.addGlobalMethod( "removeGamePlayer", function( action, playerId) {
  if( !_.isUndefined( action.game.playersMap[playerId] ) ) {
      action.game.state.totalPlayers--;
      delete action.game.players[this.playersMap[playerId]];
      delete action.game.playersMap[playerId];
      return true;
  }
});

GameState.addGlobalMethod( "getActivePlayer", function(action) {
  return action.game.players[action.game.state.activePlayer];
})

GameState.addGlobalMethod( "activePlayerDraw", function(action) {
  // Draw a single card from the players deck and place in hand
  var activePlayer = this.state.callMethod( "getActivePlayer", action );
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    activePlayer.hand.push( card );
    action.game.addGlobalGameMessage( action.game.players[action.game.state.activePlayer].playerName + " drew a card from their library" );
  }
});

GameState.addGlobalMethod( "activePlayerRegenerateMana", function(action) {
  var activePlayer = this.state.callMethod( "getActivePlayer", action );
  if( activePlayer ) {
    activePlayer.mana = activePlayer.maxMana;
  }
});

GameState.addGlobalMethod( "activePlayerIncreaseMana", function(action) {
  var activePlayer = this.state.callMethod( "getActivePlayer", action );
  if( activePlayer && activePlayer.maxMana < 10 ) {
    activePlayer.maxMana++;
  }
});


GameState.addGlobalMethod( "getAlivePlayers", function(action) {
  return _.filter( action.game.players, function(player) {
    return player.health > 0;
  });
});

GameState.addGlobalMethod( "getActionablePlayers", function(action) {
  return _.filter( action.game.players, function(player) {
    return player.health > 0 && ( player.hand.length > 0 || player.deck.length > 0 );
  });
})
