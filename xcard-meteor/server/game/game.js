// Mongo collection to represent queued game actions.
GameActions = new Mongo.Collection("GAMEACTIONS");

// Add a hook to the collection to process actions as they are added to the actions
// collection. This should happen synchronously and allow actions to be executed
// by inserting order.
// TODO: Test that this happens correctly
GameActions.find().observe({
    added: function(action) {
      var gameContainer = GameCollection.findOne(action.game);
      
      if( gameContainer && action ) {
        var game = new Game( gameContainer.game );
        action.playerGameId = game.playersMap[action.playerId];
        action.player = game.players[action.playerGameId];

        if( xCard.evaluator && xCard.evaluator.applyAction(game,action) ) {

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
