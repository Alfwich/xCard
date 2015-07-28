// Setup the xCard GameStates and xCardEvaluator

// Convient state labels
var STATE_HAS_CHANGED = true,
    INIT_STATE        = "init",
    MAIN_STATE_START  = "mainStart",
    MAIN_STATE        = "main",
    MAIN_STATE_END    = "mainEnd",
    FINISHED_STATE    = "finished";

var initState      = new GameState(INIT_STATE);
var mainStateStart = new GameState(MAIN_STATE_START);
var mainState      = new GameState(MAIN_STATE);
var mainStateEnd   = new GameState(MAIN_STATE_END);
var finishedState  = new GameState(FINISHED_STATE);


// Init State
initState.addAction( "select-deck", function(request) {
  var deck = UserDeckCollection.findOne(request.data.deckId);

  if( deck ) {
    request.requestingPlayer.deck = DeckShuffler( deck );
    this.state.callMethod( "addGameMessage", request, request.requestingPlayer.name + " has chosen a deck." );
    return STATE_HAS_CHANGED;
  }
});

initState.addAction( "add-player", function(request) {
  // Only allow the creator of the game to modify players
  if( request.requestingPlayerIsCreator ) {
    var player;
    if( (player = Meteor.users.findOne( request.data.playerId )) || (player = Meteor.users.findOne( { username: request.data.username }) )) {
      if( this.state.callMethod( "addGamePlayer", request, player._id ) ) {
        this.state.callMethod( "addGameMessage", request, player.username + " has joined the game." )
        return STATE_HAS_CHANGED;
      }
    }
  }
});

initState.addAction( "remove-player", function(request) {
  // Only allow the creator of the game to modify players
  if( request.requestingPlayerIsCreator ) {
    var player;
    if( (player = Meteor.users.findOne( request.data.playerId )) || (player = Meteor.users.findOne( { username: request.data.username }) )) {
      if( this.state.callMethod( "removeGamePlayer", request, player._id )) {
        this.state.callMethod( "addGameMessage", request, player.username + " has left the game." )
        return STATE_HAS_CHANGED;
      }
    }
  }
});


initState.addTransition( "noPlayers", 0, function(request) {
  if( request.game.state.totalPlayers == 0 ) {
    return FINISHED_STATE;
  }
});

initState.addTransition( "allPlayersReady", 1, function(request) {
  // Make sure that there are more than 1 players going into the playing state
  if( request.game.state.totalPlayers > 1 ) {
    // Check to see if all players have selected a deck. If this is true then
    // for each player draw 10 cards and start the game.
    if( _.every(request.game.players, function(player){ return player.deck; })) {

      // For each player take the top 10 cards from their deck and place into their hand
      _.each( request.game.players, function(player,playerGameId,players) {
        players[playerGameId].hand = players[playerGameId].deck.splice(0,10);
      });


      return MAIN_STATE_START;
    }
  }
});

// Main Start State
mainStateStart.addEvent( "init", function(request) {

  // Have the active player draw a card
  this.state.callMethod( "activePlayerDraw", request );

  // Restore mana and add one more max mana
  this.state.callMethod( "activePlayerIncreaseMana", request );
  this.state.callMethod( "activePlayerRegenerateMana", request );
  return STATE_HAS_CHANGED;
})

mainStateStart.addTransition( "finishedMainStart", 0, function(request) {
  return MAIN_STATE;
});

// Main State
mainState.addAction( "use-card", function(request) {
  var card = CardCollection.findOne( request.data.cardId );

  if( request.requestingPlayerGameId == request.game.state.activePlayer &&
      card && _.contains(request.requestingPlayer.hand, request.data.cardId ) &&
      request.requestingPlayer.mana >= card.manaCost ) {

    // Do card requests
    request.requestingPlayer.mana -= card.manaCost;
    xCard.cardEvaluator.applyCard( card, request, this.state );

    // Remove the card from the players hand and place into discard
    request.requestingPlayer.discard.push(
      request.requestingPlayer.hand.splice(request.requestingPlayer.hand.indexOf(card._id), 1)
    );

    return STATE_HAS_CHANGED;
  }

});

mainState.addTransition( "playerMainEnding", 0, function(request) {
  return request.data.type == "pass" ? MAIN_STATE_END : null;
});

mainStateEnd.addEvent( "init", function(request) {
  // Change active player to the next player
  this.state.callMethod( "addGameSystemMessage", request,  "CHANGED ACTIVE PLAYER" );
  this.state.callMethod( "setNextActivePlayer", request );
  return STATE_HAS_CHANGED;
});

mainStateEnd.addTransition( "notEnoughAlivePlayers", 0, function(request) {
  // Check to see if there is only one player alive. If this is true then
  // the game is over and the remaining player is the winner ( or a draw if none )
  var alivePlayers = this.state.callMethod( "getAlivePlayers", request );

  if( alivePlayers.length < 2 ) {

    if( alivePlayers.length == 1 ) {
      // Do some winning player cleanup
      this.state.callMethod( "addGameMessage", request,  alivePlayers[0].name + " has won the game!" );
    } else {
      this.state.callMethod( "addGameMessage", request,  "Draw between post-alive players" );
    }

    return FINISHED_STATE;
  }
});

mainStateEnd.addTransition( "noPlayablePlayerActions", 1, function(request) {
  // Get a listing of the actionalble players
  var requestablePlayers = this.state.callMethod( "getActionablePlayers", request );

  // If we have no actionalble players then end the game
  if( !requestablePlayers.length ) {
    this.state.callMethod( "addGameMessage", request,  "Draw between alive players" );
    return FINISHED_STATE;
  }
});

mainStateEnd.addTransition( "nextPlayerStart", 2, function(request) {
  return MAIN_STATE_START;
});

// Finished State
finishedState.addAction( "restart", function(request) {
  if( request.requestingPlayerIsCreator ) {
    this.state.callMethod( "restartGame", request );
    return STATE_HAS_CHANGED;
  }
});

finishedState.addTransition( "restartGame", 0, function(request) {
  return INIT_STATE;
});

xCard.evaluator.addGameStates( initState, mainStateStart, mainState, mainStateEnd, finishedState );
