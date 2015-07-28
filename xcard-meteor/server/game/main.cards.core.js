var STATE_HAS_CHANGED = true;

xCard.cardEvaluator.registerCard("Dead At The Mist", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " breathed in death at the mist!" );
  state.callMethod( "modifyGamePlayerValue", request, request.requestingPlayerGameId, "health", -1 );
  return STATE_HAS_CHANGED;
});

xCard.cardEvaluator.registerCard("Belonging To Myself", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " crashed down with some phat philosophical banter!" );
  _.each( request.game.playersMap, function(ele) {
    state.callMethod( "modifyGamePlayerValue", request, ele, "health", -1 );
  });
  return STATE_HAS_CHANGED;
});

xCard.cardEvaluator.registerCard("Assassins Of History", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " stabbed a random player!" );
  var randomPlayerId = _.random(1,request.game.state.totalPlayers);
  state.callMethod( "modifyGamePlayerValue", request, randomPlayerId, "health", -3 );
  return STATE_HAS_CHANGED;
});

xCard.cardEvaluator.registerCard("Death At The Void", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " fell on his sword ... Ouch! D:" );
  state.callMethod( "modifyGamePlayerValue",  request, request.requestingPlayerGameId, "health", -8 );
  return STATE_HAS_CHANGED;
})

xCard.cardEvaluator.registerCard( "Enemies And Officers", function( request, state ) {
  if( request.data.targets ) {
    var playerGameId = request.game.playersMap[request.data.targets[0]];
    var player = request.game.players[playerGameId];
    state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " shocked " + player.playerName );
    state.callMethod( "modifyGamePlayerValue", request, playerGameId, "health", -2 );
    return STATE_HAS_CHANGED;
  }
});
