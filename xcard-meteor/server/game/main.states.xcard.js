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
initState.addAction( "select-deck", function(action) {
  var deck = UserDeckCollection.findOne(action.deckId);

  if( deck ) {
    action.requestingPlayer.deck = DeckShuffler( deck );
    this.state.callMethod( "addGameMessage", action, action.requestingPlayer.playerName + " has chosen a deck." );
    return STATE_HAS_CHANGED;
  }
});

initState.addAction( "add-player", function(action) {
  // Only allow the creator of the game to modify players
  if( action.requestingPlayerIsCreator ) {
    var player;
    if( (player = Meteor.users.findOne( action.playerId )) || (player = Meteor.users.findOne( { username: action.username }) )) {
      if( this.state.callMethod( "addGamePlayer", action, player._id ) ) {
        this.state.callMethod( "addGameMessage", action, player.username + " has joined the game." )
        return STATE_HAS_CHANGED;
      }
    }
  }
});

initState.addAction( "remove-player", function(action) {
  // Only allow the creator of the game to modify players
  if( action.requestingPlayerIsCreator ) {
    var player;
    if( (player = Meteor.users.findOne( action.playerId )) || (player = Meteor.users.findOne( { username: action.username }) )) {
      if( this.state.callMethod( "removeGamePlayer", action, player._id )) {
        this.state.callMethod( "addGameMessage", action, player.username + " has left the game." )
        return STATE_HAS_CHANGED;
      }
    }
  }
});


initState.addTransition( "noPlayers", 0, function(action) {
  if( action.game.state.totalPlayers == 0 ) {
    return FINISHED_STATE;
  }
});

initState.addTransition( "allPlayersReady", 1, function(action) {
  // Make sure that there are more than 1 players going into the playing state
  if( action.game.state.totalPlayers > 1 ) {
    // Check to see if all players have selected a deck. If this is true then
    // for each player draw 10 cards and start the game.
    if( _.every(action.game.players, function(player){ return player.deck; })) {

      // For each player take the top 10 cards from their deck and place into their hand
      _.each( action.game.players, function(player,playerGameId,players) {
        players[playerGameId].hand = players[playerGameId].deck.splice(0,10);
      });


      return MAIN_STATE_START;
    }
  }
});

// Main Start State
mainStateStart.addEvent( "init", function(action) {

  // Have the active player draw a card
  this.state.callMethod( "activePlayerDraw", action );

  // Restore mana and add one more max mana
  this.state.callMethod( "activePlayerIncreaseMana", action );
  this.state.callMethod( "activePlayerRegenerateMana", action );
  return STATE_HAS_CHANGED;
})

mainStateStart.addTransition( "finishedMainStart", 0, function(action) {
  return MAIN_STATE;
});

// Main State
mainState.addAction( "use-card", function(action) {
  var card = CardCollection.findOne( action.cardId );

  if( action.requestingPlayerGameId == action.game.state.activePlayer &&
      card &&
      _.contains(action.requestingPlayer.hand, action.cardId ) ) {

    // Do card actions
    xCard.cardEvaluator.applyCard( card, action, this.state );

    // Remove the card from the players hand and place into discard
    action.requestingPlayer.discard.push(
      action.requestingPlayer.hand.splice(action.requestingPlayer.hand.indexOf(card._id), 1)
    );

    return STATE_HAS_CHANGED;
  }

});

mainState.addTransition( "playerMainEnding", 0, function(action) {
  return MAIN_STATE_END;
});

mainStateEnd.addEvent( "init", function(action) {
  // Change active player to the next player
  this.state.callMethod( "addGameSystemMessage", action,  "CHANGED ACTIVE PLAYER" );
  this.state.callMethod( "setNextActivePlayer", action );
  return STATE_HAS_CHANGED;
});

mainStateEnd.addTransition( "notEnoughAlivePlayers", 0, function(action) {
  // Check to see if there is only one player alive. If this is true then
  // the game is over and the remaining player is the winner ( or a draw if none )
  var alivePlayers = this.state.callMethod( "getAlivePlayers", action );

  if( alivePlayers.length < 2 ) {

    if( alivePlayers.length == 1 ) {
      // Do some winning player cleanup
      this.state.callMethod( "addGameMessage", action,  alivePlayers[0].playerName + " has won the game!" );
    } else {
      this.state.callMethod( "addGameMessage", action,  "Draw between post-alive players" );
    }

    return FINISHED_STATE;
  }
});

mainStateEnd.addTransition( "noPlayablePlayerActions", 1, function(action) {
  // Get a listing of the actionable players
  var actionablePlayers = this.state.callMethod( "getActionablePlayers", action );

  // If we have no actionable players then end the game
  if( !actionablePlayers.length ) {
    this.state.callMethod( "addGameMessage", action,  "Draw between alive players" );
    return FINISHED_STATE;
  }
});

mainStateEnd.addTransition( "nextPlayerStart", 2, function(action) {
  return MAIN_STATE_START;
});

// Finished State
finishedState.addAction( "restart", function(action) {
  if( action.requestingPlayerIsCreator ) {
    this.state.callMethod( "restartGame", action );
    return STATE_HAS_CHANGED;
  }
});

finishedState.addTransition( "restartGame", 0, function(action) {
  return INIT_STATE;
});

xCard.evaluator.addGameStates( initState, mainStateStart, mainState, mainStateEnd, finishedState );
