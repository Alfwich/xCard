// Defines the global state actions, internalActions, and transitions

GameState.addGlobalAction( "pass", function(game,action){
  // NOOP transition for the active player
  if( action.requestingPlayerGameId == game.state.activePlayer ) {
    return true;
  }
});

GameState.addGlobalInternalAction( "activePlayerDraw", function(game,action) {
  // Draw a single card from the players deck and place in hand
  var activePlayer = game.players[game.state.activePlayer];
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    activePlayer.hand.push( card );
    game.addGlobalGameMessage( game.players[game.state.activePlayer].playerName + " drew a card from their library" );
    return true;
  }
});

GameState.addGlobalInternalAction( "activePlayerRegenerateMana", function(game,action) {
  var activePlayer = game.players[game.state.activePlayer];
  if( activePlayer ) {
    activePlayer.mana = activePlayer.maxMana;
    return true;
  }
});

GameState.addGlobalInternalAction( "activePlayerIncreaseMana", function(game,action) {
  var activePlayer = game.players[game.state.activePlayer];
  if( activePlayer && activePlayer.maxMana < 10 ) {
    activePlayer.maxMana++;
    return true;
  }
});


GameState.addGlobalInternalAction( "getAlivePlayers", function(game, action){
  return _.filter( game.players, function(player) {
    return player.health > 0;
  });
});

GameState.addGlobalInternalAction( "getActionablePlayers", function(game, action) {
  return _.filter( game.players, function(player) {
    return player.health > 0 && ( player.hand.length > 0 || player.deck.length > 0 );
  });
})
