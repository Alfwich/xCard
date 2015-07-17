// Game: Responsible for controlling game logic and operations. This object
//       is the central repository for any game state.
Game = function(raw) {

  this.creator = _.get(raw, "creator");
  this.players = _.get(raw, "players", {});
  this.options = _.get(raw, "options", {});
  this.state = _.get(raw, "state", { current: "begin" });
  this.messages = _.get(raw, "messages", []);

  this._initPlayers(_.get(raw,"initPlayers",[]));
}

Game.prototype._initPlayers = function(players) {
  _.each(players, function(playerId) {
    this.players[playerId] = {
      playerId: playerId,
      deck: null,
      hand: null,
      battlefield: []
    };
  }.bind(this));
}

Game.prototype.handleAction = function(action) {
  var result = null;
  // Check to make sure the player is involved in the game
  switch(action.type) {
    case "select-deck":
      var deck = UserDeckCollection.findOne(action.deckId);
      if(deck) {
        this.players[action.playerId].deck = DeckShuffler( deck );
        result = true;
      }
    break;

    case "shuffle-deck":
      this.players[action.playerId].deck = _.shuffle(this.players[action.playerId].deck);
    break;
  }

  // If the action was successful then attempt to further the game state
  if(result) {
    this.updateGameState();
  }

  return result;
}

Game.prototype.updateGameState = function() {
  switch(this.state.current) {
    case "begin":
      // Check to see if all players have selected a deck. If this is true then
      // for each player draw 10 cards and start the game.
      if( _.every(this.players, function(player){ return player.deck; })) {
        this.state.current = "playing"

        // For each player take the top 10 cards from their deck and place into their hand
        _.each( this.players, function(player,playerId,players) {
          players[playerId].hand = players[playerId].deck.splice(0,10);
        });
      }

    break;
  }
}
