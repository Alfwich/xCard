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
initState.addAction( "select-deck", function(game,action) {
  var deck = UserDeckCollection.findOne(action.deckId);

  if( deck ) {
    action.requestingPlayer.deck = DeckShuffler( deck );
    this.state.callMethod( "addGameMessage", game, action, action.requestingPlayer.playerName + " has chosen a deck." );
    return STATE_HAS_CHANGED;
  }
});

initState.addAction( "add-player", function(game,action) {
  // Only allow the creator of the game to modify players
  if( action.requestingPlayerIsCreator ) {
    var player;
    if( (player = Meteor.users.findOne( action.playerId )) || (player = Meteor.users.findOne( { username: action.username }) )) {
      if( game.addPlayer( player._id ) ) {
        game.addGlobalGameMessage( player.username + " has joined the game." );
        return STATE_HAS_CHANGED;
      }
    }
  }
});

initState.addAction( "remove-player", function(game,action) {
  // Only allow the creator of the game to modify players
  if( action.requestingPlayerIsCreator ) {
    var player;
    if( (player = Meteor.users.findOne( action.playerId )) || (player = Meteor.users.findOne( { username: action.username }) )) {
      if( game.removePlayer( player._id ) ) {
        game.addGlobalGameMessage( player.username + " has left the game." );
        return STATE_HAS_CHANGED;
      }
    }
  }
});


initState.addTransition( "noPlayers", 0, function(game,action) {
  if( game.state.totalPlayers == 0 ) {
    return FINISHED_STATE;
  }
});

initState.addTransition( "allPlayersReady", 1, function(game,action) {
  // Make sure that there are more than 1 players going into the playing state
  if( game.state.totalPlayers > 1 ) {
    // Check to see if all players have selected a deck. If this is true then
    // for each player draw 10 cards and start the game.
    if( _.every(game.players, function(player){ return player.deck; })) {

      // For each player take the top 10 cards from their deck and place into their hand
      _.each( game.players, function(player,playerGameId,players) {
        players[playerGameId].hand = players[playerGameId].deck.splice(0,10);
      });


      return MAIN_STATE_START;
    }
  }
});

// Main Start State
mainStateStart.addEvent( "init", function(game,action) {

  // Have the active player draw a card
  this.state.callMethod( "activePlayerDraw", game, action );

  // Restore mana and add one more max mana
  this.state.callMethod( "activePlayerIncreaseMana", game, action );
  this.state.callMethod( "activePlayerRegenerateMana", game, action );
  return STATE_HAS_CHANGED;
})

mainStateStart.addTransition( "finishedMainStart", 0, function(game,action) {
  return MAIN_STATE;
});

// Main State
mainState.addAction( "use-card", function(game,action) {
  var card = CardCollection.findOne( action.cardId );

  if( action.requestingPlayerGameId == game.state.activePlayer &&
      card &&
      _.contains(action.requestingPlayer.hand, action.cardId ) ) {

    // Do card actions
    xCard.cardEvaluator.applyCard( card, game, action );

    // Remove the card from the players hand and place into discard
    action.requestingPlayer.discard.push(
      action.requestingPlayer.hand.splice(action.requestingPlayer.hand.indexOf(card._id), 1)
    );

    return STATE_HAS_CHANGED;
  }

});

mainState.addTransition( "playerMainEnding", 0, function(game,action) {
  return MAIN_STATE_END;
});

mainStateEnd.addEvent( "init", function(game,action) {
  // Change active player to the next player
  game.addSystemMessage( "CHANGED ACTIVE PLAYER" );
  game.setNextActivePlayer();
  return STATE_HAS_CHANGED;
});

mainStateEnd.addTransition( "notEnoughAlivePlayers", 0, function(game,action) {
  // Check to see if there is only one player alive. If this is true then
  // the game is over and the remaining player is the winner ( or a draw if none )
  var alivePlayers = this.state.callMethod( "getAlivePlayers", game, action );

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

mainStateEnd.addTransition( "noPlayablePlayerActions", 1, function(game,action) {
  // Get a listing of the actionable players
  var actionablePlayers = this.state.callMethod( "getActionablePlayers", game, action );

  // If we have no actionable players then end the game
  if( !actionablePlayers.length ) {
    game.addGlobalGameMessage( "Draw between alive players" );
    return FINISHED_STATE;
  }
});

mainStateEnd.addTransition( "nextPlayerStart", 2, function(game,action) {
  return MAIN_STATE_START;
});

// Finished State
finishedState.addAction( "restart", function(game,action) {
  if( action.requestingPlayerIsCreator ) {
    game.restart();
    return STATE_HAS_CHANGED;
  }
});

finishedState.addTransition( "restartGame", 0, function(game,action) {
  return INIT_STATE;
});

xCard.evaluator.addGameStates( initState, mainStateStart, mainState, mainStateEnd, finishedState );
