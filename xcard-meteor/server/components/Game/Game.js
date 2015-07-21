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

      this.addGameMessage( UserCollection.findOne(playerId).username + " has joined the game." );
    }.bind(this));
  }
}

Game.prototype.handleAction = function(action) {
  var result = null;

  // Resolve the playerId for the acting player
  action.playerGameId = this.playersMap[action.playerId];
  var player = this.players[action.playerGameId];

  if( action.playerGameId ) {
    // Switch based on the action.
    // TODO: Create some way to gate actions based on the current game state
    switch(action.type) {
      case "select-deck":
        var deck = UserDeckCollection.findOne(action.deckId);
        if( deck ) {
          this.players[action.playerGameId].deck = DeckShuffler( deck );
          this.addGameMessage( player.playerName + " has chosen a deck." );
          result = true;
        }
      break;

      case "shuffle-deck":
        this.players[action.playerGameId].deck = _.shuffle(this.players[action.playerGameId].deck);
      break;

      case "use-card":
        var card = CardCollection.findOne( action.cardId );

        if( action.playerGameId == this.state.activePlayer &&
            card &&
            _.contains(this.players[action.playerGameId].hand, action.cardId ) ) {

          // Do card actions
          this.addGameMessage( player.playerName + " used card " + action.cardId );

          // Remove the card from the players hand and place into discard
          player.discard.push( player.hand.splice(player.hand.indexOf(action.cardId), 1) );


          // Draw a single card from the players deck and place in hand
          player.hand.push( player.deck.splice(0,1) );

          // Change active player to the next player
          this.state.activePlayer =
            (this.state.activePlayer == this.state.totalPlayers) ? 1 : this.state.activePlayer+1;

          result = true;
        }
    }

    // If the action was successful then attempt to further the game state
    if(result) {
      this.updateGameState();
    }

  }

  return result;
}

Game.prototype.addGameMessage = function(msg) {
  this.messages.push( msg );
}

Game.prototype.updateGameState = function() {
  switch(this.state.current) {
    case "init":
      // Check to see if all players have selected a deck. If this is true then
      // for each player draw 10 cards and start the game.
      if( _.every(this.players, function(player){ return player.deck; })) {
        this.state.current = "playing"

        // For each player take the top 10 cards from their deck and place into their hand
        _.each( this.players, function(player,playerGameId,players) {
          players[playerGameId].hand = players[playerGameId].deck.splice(0,10);
        });
      }
    break;

    case "playing":
      // Check to see if there is only one player alive. If this is true then
      // the game is over and the remaining player is the winner ( or a draw if none )
      var alivePlayers = _.filter( this.players, function(player){
        return player.health > 0;
      });

      if( alivePlayers.length < 2 ) {
        this.state.current = "finished";
        // Do some winning player cleanup
        this.addGameMessage( alivePlayers[0].playerName + " has won the game!" );
      }

  }
}
