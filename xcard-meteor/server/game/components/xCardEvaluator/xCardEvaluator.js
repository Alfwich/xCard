// xCard Evaluator: Controls the flow of gamestate for an xCard game
xCardEvaluator = function() {
  this.states = {};
}

xCardEvaluator.prototype.addGameStates = function() {
  _.forEach(arguments, function(ele){
    this.addGameState(ele);
  }.bind(this));
}

xCardEvaluator.prototype.addGameState = function(state) {
  this.states[state.name] = state;
}

xCardEvaluator.prototype.applyAction = function(game, action) {
  var state = this.states[action.game.state.current],
      result = null;

  if( state ) {
    state.callEvent( "pre", game, action );
    result = state.applyAction( game, action );
    state.callEvent( "post", game, action );
    if( result ) {
      do { // Keep on changing states while the next state's init action return truthy
        action.game.state.current = this.states[action.game.state.current].checkForStateTransition( game, action );
      } while( this.states[action.game.state.current].callEvent( "init", game, action ) )
    }
  }

  return result;
}
