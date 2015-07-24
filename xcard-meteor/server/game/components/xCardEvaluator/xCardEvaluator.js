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
  var state = this.states[game.state.current],
      result = null;

  if( state && (result = state.applyAction( game, action )) ) {
    do { // Keep on changing states while the next state's init action return truthy
      game.state.current = this.states[game.state.current].transitionState( game, action );
    } while( this.states[game.state.current].callAction( "init", game, action ) ) 
  }

  return result;
}
