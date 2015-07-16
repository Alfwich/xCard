// Game: Responsible for controlling game logic and operations. This object
//       is the central repository for any game state.
Game = function(players, options) {
  this.players = players;
  this.options = options;

  this.state = {};
  this.messages = [];
}

Game.prototype.shuffleDecks = function() {
  this.state.decks = _.map( this.players, function(player) {
    return DeckShuffler(player.deck._id);
  });
}
