xCard.cardEvaluator.registerCard("Dead At The Mist", function(game, action) {
  game.addGlobalGameMessage( action.player.playerName + " breathed in death at the mist!" ); 
  game.modifyPlayerValue( action.playerGameId, "health", -1 );
  return true;
});

xCard.cardEvaluator.registerCard("Belonging To Myself", function(game,action) {
  game.addGlobalGameMessage( action.player.playerName + " crashed down with some phat philosophical banter!" ); 
  _.each( game.playersMap, function(ele) {
    game.modifyPlayerValue( ele, "health", -1 );
  });
  return true;
});


xCard.cardEvaluator.registerCard("Assassins Of History", function(game, action) {
  game.addGlobalGameMessage( action.player.playerName + " stabbed a random player!" ); 
  var randomPlayerId = _.random(1,game.state.totalPlayers);
  game.modifyPlayerValue( randomPlayerId, "health", -3 );
  return true;
});

xCard.cardEvaluator.registerCard("Death At The Void", function(game, action) {
  game.addGlobalGameMessage( action.player.playerName + " fell on his sword and died... D:" );
  game.modifyPlayerValue( action.playerGameId, "health", -1337 );
})
