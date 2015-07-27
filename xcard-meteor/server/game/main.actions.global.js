// Defines the global state actions, Methods, and transitions
var STATE_HAS_CHANGED = true;

GameState.addGlobalAction( "pass", function(action){
  // Allows the current active player to pass their turn without performing an action
  if( action.requestingPlayerGameId == action.game.state.activePlayer ) {
    action.game.addGlobalGameMessage( action.requestingPlayer.playerName + " did nothing and passed their turn" );
    return STATE_HAS_CHANGED;
  }
});
