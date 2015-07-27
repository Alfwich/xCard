xCard.cardEvaluator.registerCard("Dead At The Mist", function(game, action) {
  action.game.addGlobalGameMessage( action.requestingPlayer.playerName + " breathed in death at the mist!" );
  action.game.modifyPlayerValue( action.requestingPlayerGameId, "health", -1 );
  return true;
});

xCard.cardEvaluator.registerCard("Belonging To Myself", function(game,action) {
  action.game.addGlobalGameMessage( action.requestingPlayer.playerName + " crashed down with some phat philosophical banter!" );
  _.each( action.game.playersMap, function(ele) {
    action.game.modifyPlayerValue( ele, "health", -1 );
  });
  return true;
});

xCard.cardEvaluator.registerCard("Assassins Of History", function(game, action) {
  action.game.addGlobalGameMessage( action.requestingPlayer.playerName + " stabbed a random player!" );
  var randomPlayerId = _.random(1,action.game.state.totalPlayers);
  action.game.modifyPlayerValue( randomPlayerId, "health", -3 );
  return true;
});

xCard.cardEvaluator.registerCard("Death At The Void", function(game, action) {
  action.game.addGlobalGameMessage( action.requestingPlayer.playerName + " fell on his sword ... Ouch! D:" );
  action.game.modifyPlayerValue( action.requestingPlayerGameId, "health", -8 );
})
