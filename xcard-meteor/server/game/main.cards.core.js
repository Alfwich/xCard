xCard.cardEvaluator.registerCard("Dead At The Mist", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " breathed in death at the mist!" );
  state.callMethod( "modifyGamePlayerValue", request, request.requestingPlayerGameId, "health", -1 );
  return true;
});

xCard.cardEvaluator.registerCard("Belonging To Myself", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " crashed down with some phat philosophical banter!" );
  _.each( request.game.playersMap, function(ele) {
    state.callMethod( "modifyGamePlayerValue", request, ele, "health", -1 );
  });
  return true;
});

xCard.cardEvaluator.registerCard("Assassins Of History", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " stabbed a random player!" );
  var randomPlayerId = _.random(1,request.game.state.totalPlayers);
  state.callMethod( "modifyGamePlayerValue", request, randomPlayerId, "health", -3 );
  return true;
});

xCard.cardEvaluator.registerCard("Death At The Void", function(request, state) {
  state.callMethod( "addGameMessage", request, request.requestingPlayer.playerName + " fell on his sword ... Ouch! D:" );
  state.callMethod( "modifyGamePlayerValue",  request.requestingPlayerGameId, "health", -8 );
})
