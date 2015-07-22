// xCard Evaluator: Controls the flow of gamestate for an xCard game
xCardEvaluator = function() {
  this.states = {};
}

xCardEvaluator.prototype.addGameState = function(state) {
  this.states[state.name] = state;
}

xCardEvaluator.prototype.applyAction = function(game, action) {
  var state = this.states[game.state.current],
      result = null;

  if(state && (result = state.applyAction( game, action ))) {
    game.state.current = state.transitionState( game, action );
  }

  return result;
}

