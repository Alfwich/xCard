// Defines the global state actions, Methods, and transitions

GameState.addGlobalAction( "pass", function(game,action){
  // NOOP transition for the active player
  if( action.requestingPlayerGameId == game.state.activePlayer ) {
    return STATE_HAS_CHANGED;
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
