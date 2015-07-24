// Setup the xCard GameStates and xCardEvaluator

// Convient state labels
var INIT_STATE       = "init",
    MAIN_STATE_START = "mainStart",
    MAIN_STATE       = "main",
    MAIN_STATE_END   = "mainEnd",
    FINISHED_STATE   = "finished";

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
    game.addGlobalGameMessage( action.requestingPlayer.playerName + " has chosen a deck." );
    return true;
  }
});

initState.addAction( "add-player", function(game,action) {
  // Only allow the creator of the game to modify players
  if( action.requestingPlayerIsCreator ) {
    var player;
    if( (player = Meteor.users.findOne( action.playerId )) || (player = Meteor.users.findOne( { username: action.username }) )) {
      if( game.addPlayer( player._id ) ) {
        game.addGlobalGameMessage( player.username + " has joined the game." );
        return true;
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
        return true;
      }
    }
  }
});


initState.addTransition( "noPlayers", function(game,action) {
  if( game.state.totalPlayers == 0 ) {
    return FINISHED_STATE;
  }
});

initState.addTransition( "allPlayersReady", function(game,action) {
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
mainStateStart.addInternalAction( "init", function(game,action) {

  // Restore mana and add one more max mana
  game.players[game.state.activePlayer].mana = ++game.players[game.state.activePlayer].maxMana;
  return true;
})

mainStateStart.addTransition( "finishedMainStart", function(game,action) {
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

    return true;
  }

});

mainState.addTransition( "playerMainEnding", function(game,action) {
  return MAIN_STATE_END;
});

mainStateEnd.addInternalAction( "init", function(game,action) {
  // Change active player to the next player
  game.addSystemMessage( "CHANGED ACTIVE PLAYER" );
  game.setNextActivePlayer();
  return true;
});

mainStateEnd.addTransition( "noPlayablePlayerActions", function(game,action) {
  // Check to see if we have any players that can perform action
  var haveActionablePlayers = _.some( game.players, function(player) {
    return player.health > 0 && ( player.hand.length > 0 || player.deck.length > 0 );
  });

  // If we have none then transition to the finished state
  if( !haveActionablePlayers ) {
    game.addGlobalGameMessage( "Draw between alive players" );
    return FINISHED_STATE;
  }
});

mainStateEnd.addTransition( "notEnoughAlivePlayers", function(game,action) {
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

mainStateEnd.addTransition( "nextPlayerStart", function(game,action) {
  return MAIN_STATE_START;
});

// Finished State
finishedState.addAction( "restart", function(game,action) {
  game.restart();
  return true;
});

finishedState.addTransition( "restartGame", function(game,action) {
  return INIT_STATE;
});

xCard.evaluator.addGameStates( initState, mainStateStart, mainState, mainStateEnd, finishedState );
