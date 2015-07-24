// Mongo collection to represent queued game actions.
GameActions = new Mongo.Collection("GAMEACTIONS");

// Will provide the action with game specific data
var packAction = function(game,action) {
  action.requestingPlayerGameId = game.playersMap[action.requestingPlayerId];
  action.requestingPlayer = game.players[action.requestingPlayerGameId];
  action.requestingPlayerIsCreator = action.requestingPlayerId == game.creator;
  return action;
}

// Add a hook to the collection to process actions as they are added to the actions
// collection. This should happen synchronously and allow actions to be executed
// by inserting order.
// TODO: Test that this happens correctly
GameActions.find().observe({
    added: function(action) {
      var gameContainer = GameCollection.findOne(action.gameId);

      if( gameContainer && action ) {
        var game = new Game( gameContainer.game );
        action = packAction( game, action );

        // Check to make sure that the requesting player is actually in the game( or is the creator of the game ),
        // that we have a evaluator defined. Then if the action caused a change in game state
        // then update the game collection with the new state of the game
        if(( action.requestingPlayer || action.requestingPlayerIsCreator ) &&
             xCard.evaluator && xCard.evaluator.applyAction(game,action )) {

          // Update the game state if a change has been registered
          GameCollection.update(gameContainer._id, { $set: { game: game } });
        }

      }

      // After the action has been completed then remove it from the collection
      GameActions.remove( action._id );
    }
});

// Setup the game evaluator. States are added in the states folder
xCard.evaluator = new xCardEvaluator();
xCard.cardEvaluator = new CardEvaluator();
