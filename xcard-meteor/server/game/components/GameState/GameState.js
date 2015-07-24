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

GameState.boundMethodName = function(method,name) {
  return method.bind({ name: name });
}

GameState.globalActions = {};
GameState.addGlobalAction = function(actionType, method) {
  method.name = actionType;
  GameState.globalActions[actionType] = GameState.boundMethodName( method, actionType );
}

GameState.globalInternalActions = {};
GameState.addGlobalInternalAction = function(actionType, method) {
  GameState.globalInternalActions[actionType] = GameState.boundMethodName( method, actionType );
}

GameState.globalTransitions = [];
GameState.addGlobalTransition = function(transitionName, condition) {
  GameState.globalTransitions.push({ name: transitionName, condition: GameState.boundMethodName(condition, transitionName) });
}

GameState.prototype.addAction = function(actionType, method) {
  this.actions[actionType] = GameState.boundMethodName( method, actionType );
}

GameState.prototype.addInternalAction = function(actionType, method) {
  this.internalActions[actionType] = GameState.boundMethodName( method, actionType );
}

GameState.prototype.addTransition = function(transitionName, condition) {
  this.transitions.push({ name: transitionName, condition: GameState.boundMethodName( condition, transitionName ) });
}

GameState.prototype.applyAction = function(gameState,userAction) {
  var action = this.actions[userAction.type] || GameState.globalActions[userAction.type],
      result = false;

  if(action) {
    result = action(gameState,userAction);
    gameState.addSystemMessage( "FINISHED ACTION '" + userAction.type + "'" );
  }

  return result;
}

// Allows actions to call other actions and internal actions to be called
GameState.prototype.callAction = function( actionName, gameState, userAction ) {
  // Find the correct action to call starting with internal actions first then normal actions
  var action = this.internalActions[actionName] || GameState.globalInternalActions[actionName] || 
               this.actions[actionName]         || GameState.globalActions[actionName];

  if( action ) {
    return action( gameState, userAction );
  }
}

// Checks each transition to see if the current gameState warrents a transition
GameState.prototype.transitionState = function(gameState, userAction) {
  var result = null;

  _.find( GameState.globalTransitions.concat(this.transitions), function(transition){
    result = transition.condition(gameState, userAction);
    if( result ) {
      gameState.addSystemMessage( "TRANSITIONED TO STATE '" + result + "' FROM '" + this.name + "' THROUGH '" + transition.name + "'" );
      return true;
    }
  }.bind(this));

  return result ? result : this.name;
}
