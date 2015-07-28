// Defines the global state actions, Methods, and transitions
var STATE_HAS_CHANGED = true;

GameState.addGlobalAction( "pass", function(request){
  // Allows the current active player to pass their turn without performing an action
  if( request.requestingPlayerGameId == request.game.state.activePlayer ) {
    this.state.callMethod( "addGameMessage", request,  request.requestingPlayer.name + " passed their turn" );
    return STATE_HAS_CHANGED;
  }
});
