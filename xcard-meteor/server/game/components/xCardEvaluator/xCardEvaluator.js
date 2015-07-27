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

xCardEvaluator.prototype.handleRequest = function(request) {
  var state = this.states[request.game.state.current],
      result = null;

  if( state ) {
    state.callEvent( "pre", request );
    result = state.applyAction( request );
    state.callEvent( "post", request );
    if( result ) {
      do { // Keep on changing states while the next state's init event return truthy
        request.game.state.current = this.states[request.game.state.current].checkForStateTransition( request );
      } while( this.states[request.game.state.current].callEvent( "init", request ) )
    }
  }

  return result;
}
