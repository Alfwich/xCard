// GameState.js: Defines a current state of the xCard card game
//  name:        The name of the defined state
//  actions:     The available actions for the state. Actions from the client are passed to
//               a state through the applyAction method. Each action needs to return a truthy
//               value if any state change has occured elsewise the changes will not get recorded.
//               actions need to take the following form: fn(game,action) => bool
//  transitions: If the action results in a change of state then the transitions will be checked
//               to see if the current state warrents a state transition. Methods registered as a
//               transition need to take the following form: fn(game,action) => newState
GameState = function(name, actions, transitions) {
  this.name = name;
  this.actions = actions || {};
  this.internalActions = actions || {};
  this.transitions = transitions || [];
}

GameState.prototype.addAction = function(actionType, method) {
  this.actions[actionType] = method;
}

GameState.prototype.addInternalAction = function(actionType, method) {
  this.internalActions[actionType] = method;
}

GameState.prototype.addTransition = function(transitionName, condition) {
  this.transitions.push( { name: transitionName, condition: condition } );
}

GameState.prototype.applyAction = function(gameState,userAction) {
  var action = this.actions[userAction.type],
      result = false;

  if(action) {
    result = action(gameState,userAction);
    gameState.addSystemMessage( "FINISHED ACTION '" + userAction.type + "'" );
  }

  return result;
}

// Allows actions to call other actions and internal actions to be called
GameState.prototype.callAction = function( actionName, gameState, userAction ) {
  var action = this.actions[actionName] || this.internalActions[actionName];
  if( action ) {
    return action( gameState, userAction );
  }
}

// Checks each transition to see if the current gameState warrents a transition
GameState.prototype.transitionState = function(gameState,userAction) {
  var result = null;

  _.find( this.transitions, function(transition){
    result = transition.condition(gameState, userAction);
    if( result ) {
      gameState.addSystemMessage( "TRANSITIONED TO STATE '" + result + "' FROM '" + this.name + "' THROUGH '" + transition.name + "'" );
      return true;
    }
  }.bind(this));

  return result ? result : this.name;
}
