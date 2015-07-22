// Setup the xCard GameStates and xCardEvaluator

// Convient state labels
var INIT_STATE = "init",
    PLAY_STATE = "playing",
    FINISHED_STATE = "finished";

var initState     = new GameState(INIT_STATE);
var playingState  = new GameState(PLAY_STATE);
var finishedState = new GameState(FINISHED_STATE);

// Init State
initState.addAction( "select-deck", function(game,action) {
  var deck = UserDeckCollection.findOne(action.deckId);
  var player = game.players[action.playerGameId];

  if( deck ) {
    game.players[action.playerGameId].deck = DeckShuffler( deck );
    game.addGlobalGameMessage( player.playerName + " has chosen a deck." );
    return true;
  }
});

initState.addTransition( function(game,action) {
  // Check to see if all players have selected a deck. If this is true then
  // for each player draw 10 cards and start the game.
  if( _.every(game.players, function(player){ return player.deck; })) {

    // For each player take the top 10 cards from their deck and place into their hand
    _.each( game.players, function(player,playerGameId,players) {
      players[playerGameId].hand = players[playerGameId].deck.splice(0,10);
    });


    // Draw one additional card for the active player
    game.activePlayerDrawCard();

    return PLAY_STATE;
  }
});

// Playing State
playingState.addAction( "use-card", function(game,action) {
  var card = CardCollection.findOne( action.cardId );
  var player = game.players[action.playerGameId];

  if( action.playerGameId == game.state.activePlayer &&
      card &&
      _.contains(game.players[action.playerGameId].hand, action.cardId ) ) {

    // Do card actions
    xCard.cardEvaluator.applyCard( card, game, action );

    // Remove the card from the players hand and place into discard
    player.discard.push( player.hand.splice(player.hand.indexOf(action.cardId), 1) );

    playingState.callAction( "pass-turn", game, action );

    return true;
  }

});

playingState.addAction( "pass-turn" , function(game,action){
  // Move the active player to the next player with cards
  // Change active player to the next player
  game.state.activePlayer =
    (game.state.activePlayer == game.state.totalPlayers) ? 1 : game.state.activePlayer+1;

  game.addSystemMessage( "CHANGED ACTIVE PLAYER" );

  // Draw a card for the active player
  game.activePlayerDrawCard();

  return true;
});

playingState.addTransition( function(game,action) {
  // Check to see if there is only one player alive. If this is true then
  // the game is over and the remaining player is the winner ( or a draw if none )
  var alivePlayers = _.filter( game.players, function(player){
    return player.health > 0;
  });

  if( alivePlayers.length < 2 ) {

    if( alivePlayers.length == 1 ) {
      // Do some winning player cleanup
      game.addGlobalGameMessage( alivePlayers[0].playerName + " has won the game!" );
    } else {
      game.addGlobalGameMessage( "Draw between post-alive players" );
    }

    return FINISHED_STATE;
  }
});

// Finished State

xCard.evaluator.addGameStates( initState, playingState, finishedState );












