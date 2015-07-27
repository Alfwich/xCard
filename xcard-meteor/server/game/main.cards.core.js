xCard.cardEvaluator.registerCard("Dead At The Mist", function(action, state) {
  state.callMethod( "addGameMessage", action, action.requestingPlayer.playerName + " breathed in death at the mist!" );
  state.callMethod( "modifyGamePlayerValue", action, action.requestingPlayerGameId, "health", -1 );
  return true;
});

xCard.cardEvaluator.registerCard("Belonging To Myself", function(action, state) {
  state.callMethod( "addGameMessage", action, action.requestingPlayer.playerName + " crashed down with some phat philosophical banter!" );
  _.each( action.game.playersMap, function(ele) {
    state.callMethod( "modifyGamePlayerValue", action, ele, "health", -1 );
  });
  return true;
});

xCard.cardEvaluator.registerCard("Assassins Of History", function(action, state) {
  state.callMethod( "addGameMessage", action, action.requestingPlayer.playerName + " stabbed a random player!" );
  var randomPlayerId = _.random(1,action.game.state.totalPlayers);
  state.callMethod( "modifyGamePlayerValue", action, randomPlayerId, "health", -3 );
  return true;
});

xCard.cardEvaluator.registerCard("Death At The Void", function(action, state) {
  state.callMethod( "addGameMessage", action, action.requestingPlayer.playerName + " fell on his sword ... Ouch! D:" );
  state.callMethod( "modifyGamePlayerValue",  action.requestingPlayerGameId, "health", -8 );
})
