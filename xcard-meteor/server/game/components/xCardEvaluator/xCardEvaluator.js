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

  if(state && (result = state.applyAction( game, action ))) {
    var newState = state.transitionState( game, action );
    if( newState != game.state.current ) {
      game.addSystemMessage( "TRANSITION TO STATE '" + newState + "'" );
      game.state.current = newState;
    }
  }

  return result;
}

