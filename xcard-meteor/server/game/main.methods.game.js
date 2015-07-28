// Defines global methods for game requests.

GameState.addGlobalMethod( "addGameMessage", function( request, msg ) {
  request.game.messages.push( msg );
  return true;
});

GameState.addGlobalMethod( "addGameSystemMessage", function( request, msg ) {
  return this.state.callMethod( "addGameMessage", request, "###SYSTEM: " + msg );
});

GameState.addGlobalMethod( "modifyGamePlayerValue", function( request, playerId, attr, delta ) {
  var player = request.game.players[playerId];

  if( player && player[attr] ) {
    this.state.callMethod( "addGameMessage", request, ( player.playerName + (delta>0?" gained ":" lost ") + Math.abs(delta) + " " + attr ) );
    player[attr] += delta;
    return true;
  }
});

GameState.addGlobalMethod( "activePlayerDrawCard", function( request ) {
  // Draw a single card from the players deck and place in hand
  var activePlayer = request.game.players[request.game.state.activePlayer];
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    activePlayer.hand.push( card );
  }
});

var playerCanPerformActions = function(player) {
  return (!_.isUndefined(player)) && player.health >= 0 && ( player.deck.length > 0 || player.hand.length > 0 );
}

var nextId = function(id, maxPlayers) {
  return (id+1>maxPlayers) ? 1 : id+1;
}

GameState.addGlobalMethod( "setNextActivePlayer", function( request ) {

  // Produce an array of all playerIds to make sure if all players are checked and
  // we cannot find a valid active player we exit the loop
  var playerAttemptedIds = _.map( request.game.players, function(ele) {
    return ele.playerId;
  }),
      maxPlayerId = Math.max.apply( null, Object.keys( request.game.players ) );

  do {
    request.game.state.activePlayer = nextId( request.game.state.activePlayer, maxPlayerId );
    var player = request.game.players[request.game.state.activePlayer];
    if( player ) {
      playerAttemptedIds.pop( playerAttemptedIds.indexOf( player.playerId ) );
    }
    // If the player cannot perform actions and we have players left to check
    // then repeat the selection process
  } while( !playerCanPerformActions(player) && playerAttemptedIds.length > 0 );

  return this.state.callMethod( "getActivePlayer" );
});

GameState.addGlobalMethod( "restartGame", function(request) {
  _.forEach( request.game.players, function(player) {
    this.state.callMethod( "removeGamePlayer", request, player.playerId );
    this.state.callMethod( "addGamePlayer", request, player.playerId );
  }.bind(this));

  request.game.state.activePlayer = 1;
  request.game.messages = [];
});

var nextInsertPlayerId = function(players) {
  var result = 1;
  while( !_.isUndefined(players[result])){ result++; }
  return result;
}

GameState.addGlobalMethod( "addGamePlayer", function( request, playerId ){
  if( _.isUndefined( request.game.playersMap[playerId] ) ) {
    var playerGameId = nextInsertPlayerId(request.game.players);
    request.game.state.totalPlayers++;
    request.game.playersMap[playerId] = playerGameId;
    request.game.players[playerGameId] = new Player( playerId, playerGameId );
    this.state.callMethod( "addGameTarget", request, playerId, "player", UserCollection.findOne(playerId).username );
    return true;
  }
});

GameState.addGlobalMethod( "removeGamePlayer", function( request, playerId) {
  if( !_.isUndefined( request.game.playersMap[playerId] ) ) {
      request.game.state.totalPlayers--;
      delete request.game.players[request.game.playersMap[playerId]];
      delete request.game.playersMap[playerId];
      this.state.callMethod( "removeGameTarget", request, playerId );
      return true;
  }
});

GameState.addGlobalMethod( "addGameTarget", function(request, targetId, type, name ){
  if( request.game ) {
    request.game.targets[targetId] = { id: targetId, type: type, name: name };
  }
});

GameState.addGlobalMethod( "removeGameTarget", function(request, targetId ){
  if( request.game && request.game.targets[targetId] ) {
    delete request.game.targets[targetId];
  }
});

GameState.addGlobalMethod( "getActivePlayer", function(request) {
  return request.game.players[request.game.state.activePlayer];
})

GameState.addGlobalMethod( "activePlayerDraw", function(request) {
  // Draw a single card from the players deck and place in hand
  var activePlayer = this.state.callMethod( "getActivePlayer", request );
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    activePlayer.hand.push( card );
    this.state.callMethod( "addGlobalGameMessage", request, request.game.players[request.game.state.activePlayer].playerName + " drew a card from their library" );
  }
});

GameState.addGlobalMethod( "activePlayerRegenerateMana", function(request) {
  var activePlayer = this.state.callMethod( "getActivePlayer", request );
  if( activePlayer ) {
    activePlayer.mana = activePlayer.maxMana;
  }
});

GameState.addGlobalMethod( "activePlayerIncreaseMana", function(request) {
  var activePlayer = this.state.callMethod( "getActivePlayer", request );
  if( activePlayer && activePlayer.maxMana < 10 ) {
    activePlayer.maxMana++;
  }
});


GameState.addGlobalMethod( "getAlivePlayers", function(request) {
  return _.filter( request.game.players, function(player) {
    return player.health > 0;
  });
});

GameState.addGlobalMethod( "getActionablePlayers", function(request) {
  return _.filter( request.game.players, function(player) {
    return player.health > 0 && ( player.hand.length > 0 || player.deck.length > 0 );
  });
})
