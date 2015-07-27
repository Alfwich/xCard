// Defines global methods for game actions.

GameState.addGlobalMethod( "addGameMessage", function( game, action, msg ) {
  game.messages.push( msg );
  return true;
});

GameState.addGlobalMethod( "addGameSystemMessage", function( game, action, msg ) {
  return this.state.callMethod( "addGameMessage", game, action, "###SYSTEM: " + msg );
});

GameState.addGlobalMethod( "modifyGamePlayerValue", function( game, action, playerId, attr, delta ) {
  var player = game.players[playerGameId];

  if( player && player[attr] ) {
    this.state.callMethod( "addGlobalGameMessage", game, action, ( player.playerName + (delta>0?" gained ":" lost ") + Math.abs(delta) + " " + attr ) );
    player[attr] += delta;
    return true;
  }
});

GameState.addGlobalMethod( "activePlayerDrawCard", function( game, action ) {
  // Draw a single card from the players deck and place in hand
  var activePlayer = game.players[game.state.activePlayer];
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    activePlayer.hand.push( card );
  }
});

var playerCanPerformActions = function(player) {
  return (!_.isUndefined(player)) && player.health >= 0 && ( player.deck.length > 0 || player.hand.length > 0 );
}

GameState.addGlobalMethod( "setNextActivePlayer", function( game, action ) {

  // Produce an array of all playerIds to make sure if all players are checked and
  // we cannot find a valid active player we exit the loop
  var playerAttemptedIds = _.map( game.players, function(ele) {
    return ele.playerId;
  });

  do {
    game.state.activePlayer = nextId( game.state.activePlayer, game.state.totalPlayers );
    var player = game.players[game.state.activePlayer];
    if( player ) {
      playerAttemptedIds.pop( playerAttemptedIds.indexOf( player.playerId ) );
    }
    // If the player cannot perform actions and we have players left to check
    // then repeat the selection process
  } while( !playerCanPerformActions(player) && playerAttemptedIds.length > 0 );

  return this.state.callMethod( "getActivePlayer" );
});

GameState.addGlobalMethod( "restartGame", function(game,action) {
  _.forEach( game.players, function(player) {
    this.state.callMethod( "removeGamePlayer", game, action, player.playerId );
    this.state.callMethod( "addGamePlayer", game, action, player.playerId );
  }.bind(this));

  game.state.activePlayer = 1;
  game.messages = [];
});

var nextInsertPlayerId = function(players) {
  var result = 1;
  while( !_.isUndefined(players[result])){ result++; }
  return result;
}

GameState.addGlobalMethod( "addGamePlayer", function( game, action, playerId ){
  if( _.isUndefined( game.playersMap[playerId] ) ) {
    var playerGameId = nextPlayerId(game.players);
    game.state.totalPlayers++;
    game.playersMap[playerId] = playerGameId;
    game.players[playerGameId] = new Player( playerId, playerGameId );
    return true;
  }
});

GameState.addGlobalMethod( "removeGamePlayer", function( game, action, playerId) {
  if( !_.isUndefined( game.playersMap[playerId] ) ) {
      game.state.totalPlayers--;
      delete game.players[this.playersMap[playerId]];
      delete game.playersMap[playerId];
      return true;
  }
});

GameState.addGlobalMethod( "getActivePlayer", function(game,action) {
  return game.players[game.state.activePlayer];
})

GameState.addGlobalMethod( "activePlayerDraw", function(game,action) {
  // Draw a single card from the players deck and place in hand
  var activePlayer = this.state.callMethod( "getActivePlayer", game, action );
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    activePlayer.hand.push( card );
    game.addGlobalGameMessage( game.players[game.state.activePlayer].playerName + " drew a card from their library" );
  }
});

GameState.addGlobalMethod( "activePlayerRegenerateMana", function(game,action) {
  var activePlayer = this.state.callMethod( "getActivePlayer", game, action );
  if( activePlayer ) {
    activePlayer.mana = activePlayer.maxMana;
  }
});

GameState.addGlobalMethod( "activePlayerIncreaseMana", function(game,action) {
  var activePlayer = this.state.callMethod( "getActivePlayer", game, action );
  if( activePlayer && activePlayer.maxMana < 10 ) {
    activePlayer.maxMana++;
  }
});


GameState.addGlobalMethod( "getAlivePlayers", function(game, action) {
  return _.filter( game.players, function(player) {
    return player.health > 0;
  });
});

GameState.addGlobalMethod( "getActionablePlayers", function(game, action) {
  return _.filter( game.players, function(player) {
    return player.health > 0 && ( player.hand.length > 0 || player.deck.length > 0 );
  });
})
