// Defines the global state actions, Methods, and transitions
var STATE_HAS_CHANGED = true;

GameState.addGlobalAction( "pass", function(request){
  // Allows the current active player to pass their turn without performing an action
  if( request.requestingPlayerGameId == request.game.state.activePlayer ) {
    request.game.addGlobalGameMessage( request.requestingPlayer.playerName + " did nothing and passed their turn" );
    return STATE_HAS_CHANGED;
  }
});
