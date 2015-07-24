
var makeNewGame = function( playerId ) {
  return { game: new Game({ creator: playerId }) };
}

Meteor.methods({

  // This will create a new game instance for the currently logged in user.
  // This will include ALL players in the current room that the player is a member
  // of.
  createGame: function() {
    var gameId = GameCollection.insert( makeNewGame( this.userId ) );
    Meteor.call( "handleGameAction", { type: "add-player", playerId: this.userId, gameId: gameId });
  },

  handleGameAction: function(action) {
    action.game = action.gameId;
    action.requestingPlayerId = this.userId;
    GameActions.insert( action );
  }
});
