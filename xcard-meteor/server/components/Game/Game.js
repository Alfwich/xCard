// Game: Responsible for controlling game logic and operations. This object
//       is the central repository for any game state.
Game = function(raw) {

  this.creator = _.get(raw, "creator");
  this.playersMap = _.get(raw, "playersMap", {});
  this.players = _.get(raw, "players", {});
  this.options = _.get(raw, "options", {});
  this.state = _.get(raw, "state", { current: "init", activePlayer: 1 });
  this.messages = _.get(raw, "messages", []);

  this._initPlayers(_.get(raw,"initPlayers",[]));
}

Game.prototype._initPlayers = function(players) {
  if( players.length ) {
    var playerIndex = 1;
    this.state.totalPlayers = players.length;
    _.each(players, function(playerId) {
      this.playersMap[playerId] = playerIndex;
      this.players[playerIndex++] = {
        playerId: playerId,
        playerName: UserCollection.findOne(playerId).username,
        deck: null,
        hand: null,
        discard: [],
        exile: [],
        battlefield: [],
        health: 20,
        maxMana: 1,
        mana: 1,
      };

      this.addGlobalGameMessage( UserCollection.findOne(playerId).username + " has joined the game." );
    }.bind(this));
  }
}

Game.prototype.addGlobalGameMessage = function(msg) {
  this.messages.push( msg );
}

Game.prototype.addSystemMessage = function(msg) {
  this.addGlobalGameMessage( "###SYSTEM: " + msg );
}

Game.prototype.transitionState = function(newState) {
  this.state.current = newState;
  this.addSystemMessage( "TRANSITION TO '" + newState + "' STATE" );
}

Game.prototype.handleAction = function(action) {
  var result = null;

  // Resolve the playerId for the acting player
  action.playerGameId = this.playersMap[action.playerId];
  var player = this.players[action.playerGameId];

  this.addSystemMessage( "(" + player.playerName + ") COMMITED ACTION: " + action.type );
  if( action.playerGameId ) {
    // Switch based on the action.
    // TODO: Create some way to gate actions based on the current game state
    switch(action.type) {

      case "select-deck":
        var deck = UserDeckCollection.findOne(action.deckId);
        if( deck ) {
          this.players[action.playerGameId].deck = DeckShuffler( deck );
          this.addGlobalGameMessage( player.playerName + " has chosen a deck." );
          result = true;
        }
      break;

      case "use-card":
        var card = CardCollection.findOne( action.cardId );
        if( action.playerGameId == this.state.activePlayer &&
            card &&
            _.contains(this.players[action.playerGameId].hand, action.cardId ) ) {

          // Do card actions
          this.addGlobalGameMessage( player.playerName + " used card " + action.cardId );

          // Remove the card from the players hand and place into discard
          player.discard.push( player.hand.splice(player.hand.indexOf(action.cardId), 1) );


          result = true;
        }
      break;

      case "pass-turn":
      break;
    }

    // If the action was successful then attempt to further the game state
    if(result) {
      this.updateGameState();
    }

  }

  return result;
}

Game.prototype.executeCardActions = function( card, game ) {
}

Game.prototype.activePlayerDrawCard = function() {
  // Draw a single card from the players deck and place in hand
  var activePlayer = this.players[this.state.activePlayer];
  if( activePlayer.deck.length ) {
    var card = activePlayer.deck.splice(0,1)[0];
    this.addSystemMessage( activePlayer.playerName + " DREW A CARD: '" + card + "'" );
    activePlayer.hand.push( card );
  }
}

Game.prototype.updateGameState = function() {
  switch(this.state.current) {
    case "init":
      // Check to see if all players have selected a deck. If this is true then
      // for each player draw 10 cards and start the game.
      if( _.every(this.players, function(player){ return player.deck; })) {
        this.transitionState( "playing" );

        // For each player take the top 10 cards from their deck and place into their hand
        _.each( this.players, function(player,playerGameId,players) {
          players[playerGameId].hand = players[playerGameId].deck.splice(0,10);
        });


        // Draw one additional card for the active player
        this.activePlayerDrawCard();
      }
    break;

    case "playing":
      // Check to see if there is only one player alive. If this is true then
      // the game is over and the remaining player is the winner ( or a draw if none )
      var alivePlayers = _.filter( this.players, function(player){
        return player.health > 0;
      });

      if( alivePlayers.length < 2 ) {
        this.transitionState("finished");

        if( alivePlayers.length == 1 ) {
          // Do some winning player cleanup
          this.addGlobalGameMessage( alivePlayers[0].playerName + " has won the game!" );
        } else {
          this.addGlobalGameMessage( "Draw between post-alive players" );
        }
      } else {
        // Move the active player to the next player with cards
        // Change active player to the next player
        this.state.activePlayer =
          (this.state.activePlayer == this.state.totalPlayers) ? 1 : this.state.activePlayer+1;

        this.addSystemMessage( "CHANGED ACTIVE PLAYER" );

        // Draw a card for the active player
        this.activePlayerDrawCard();

      }

  }
}
