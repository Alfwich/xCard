// Mongo collection to represent queued game requests.
GameRequests = new Mongo.Collection("GAMEREQUESTS");

// Will provide the action with game specific data
var packRequest = function(request, game) {
  request.game = game;
  request.requestingPlayerGameId = request.game.playersMap[request.requestingPlayerId];
  request.requestingPlayer = request.game.players[request.requestingPlayerGameId];
  request.requestingPlayerIsCreator = request.requestingPlayerId == request.game.creator;
  return request;
}

// Add a hook to the collection to process actions as they are added to the actions
// collection. This should happen synchronously and allow actions to be executed
// by inserting order.
// TODO: Test that this happens correctly
GameRequests.find().observe({
    added: function(request) {
      var gameContainer = GameCollection.findOne(request.data.gameId);

      if( gameContainer && request ) {
        var game = new Game( gameContainer.game );
        request = packRequest( request, game );

        // Check to make sure that the requesting player is actually in the game( or is the creator of the game ),
        // that we have a evaluator defined. Then if the request caused a change in game state
        // then update the game collection with the new state of the game
        if(( request.requestingPlayer || request.requestingPlayerIsCreator ) &&
             xCard.evaluator && xCard.evaluator.handleRequest( request )) {

          // Update the game state if a change has been registered
          // TODO: Create a smarter system based on some configurable update
          // object in the requesto update only what is needed. This would
          // VASTLY improve the network performance of the entire system.
          // Currently when a game update happens the WHOLE game state is replaced
          // in the GameCollection. This means for each connected client we are
          // continously sending out the same data repeatedly.
          GameCollection.update(gameContainer._id, { $set: { game: game } });
        }

      }

      // After the action has been completed then remove it from the collection
      GameRequests.remove( request._id );
    }
});

// Setup the game evaluator.
// - States are defined in the main.states.* files
// - Cards are defined in the main.cards.* files
xCard.evaluator = new xCardEvaluator();
xCard.cardEvaluator = new CardEvaluator();
