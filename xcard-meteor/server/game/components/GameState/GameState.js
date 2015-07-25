// GameState.js: Defines a current state of the xCard card game
//  name:        The name of the defined state
//  actions:     The available actions for the state. Actions from the client are passed to
//               a state through the applyAction method. Each action needs to return a truthy
//               value if any state change has occured elsewise the changes will not get recorded.
//               actions need to take the following form: fn(game,action) => bool
//  transitions: If the action results in a change of state then the transitions will be checked
//               to see if the current state warrents a state transition. Methods registered as a
//               transition need to take the following form: fn(game,action) => newState
GameState = function(name) {
  this.name = name;
  this.actions = {};
  this.methods = {};
  this.events = {}
  this.transitions = {};
}

GameState.boundMethodName = function(method, name, state) {
  return method.bind({ name: name, state: state });
}

// Global state object which is the this.state reference for
// globalActions, globalMethods, and globalTransitions
var globalGameState = new GameState( "GLOBAL_STATE" );

GameState.addGlobalAction = function(actionType, method) {
  globalGameState.addAction( actionType, method );
}

GameState.addGlobalEvent = function(eventName, method) {
  globalGameState.addEvent( eventName, method );
}

GameState.addGlobalMethod = function(methodName, method) {
  globalGameState.addMethod( methodName, method );
}

GameState.addGlobalTransition = function(transitionName, priority, condition) {
  globalGameState.addTransition( transitionName, priority, condition );
}

GameState.prototype.addAction = function(actionType, method) {
  this.actions[actionType] = GameState.boundMethodName( method, actionType, this );
}

GameState.prototype.addEvent = function(eventName, method) {
  this.events[eventName] = GameState.boundMethodName( method, eventName, this );
}

GameState.prototype.addMethod = function(methodName, method) {
  this.methods[methodName] = GameState.boundMethodName( method, methodName, this );
}

GameState.prototype.addTransition = function(transitionName, priority, condition) {
  if( _.isUndefined( this.transitions[priority] )) {
    this.transitions[priority] = [];
  }

  this.transitions[priority].push({
    name: transitionName,
    condition: GameState.boundMethodName( condition, transitionName, this )
  });
}

GameState.prototype.applyAction = function(gameState,userAction) {
  var action = this.actions[userAction.type] || globalGameState.actions[userAction.type],
      result = false;

  if(action) {
    result = action(gameState,userAction);
    gameState.addSystemMessage( "FINISHED ACTION '" + userAction.type + "'" );
  }

  return result;
}

// Allows actions to call other actions and internal actions to be called
GameState.prototype.callAction = function( actionName, game, action ) {
  // Find the correct action to call starting with internal actions first then normal actions
  var stateAction = this.actions[actionName] || globalGameState.actions[actionName];

  if( stateAction && game && action ) {
    return stateAction( game, action );
  }
}

GameState.prototype.callMethod = function( methodName, game, action ) {
  // Find the correct method to call
  var stateMethod = this.methods[methodName] || globalGameState.methods[methodName];

  if( stateMethod && game && action ) {
    var methodArguments = [ game, action ].concat(Array.prototype.slice.call(arguments).slice(3));
    return stateMethod.apply( null, methodArguments );
  }
}

GameState.prototype.callEvent = function( eventName, game, action ) {
  // Find the correct event to call
  var stateEvent = this.events[eventName] || globalGameState.events[eventName];

  if( stateEvent && game && action ) {
    return stateEvent( game, action );
  }
}

// Checks each transition to see if the current gameState warrents a transition
GameState.prototype.checkForStateTransition = function(gameState, userAction) {
  var result = null;
  // Find the first transition of lowerst priority which return a truthy value.
  _.find( _.sortBy(Object.keys(this.transitions)), function(priority){
    return _.find( this.transitions[priority], function(transition){
      return result = transition.condition(gameState, userAction);
    });
  }.bind(this));
  
  return result ? result : this.name;
}
