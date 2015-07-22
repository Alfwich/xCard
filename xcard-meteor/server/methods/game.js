Meteor.methods({

  // This will create a new game instance for the currently logged in user.
  // This will include ALL players in the current room that the player is a member
  // of.
  createGame: function() {
    var membership = RoomMembershipCollection.findOne({ owner: this.userId }),
        allMemberships = RoomMembershipCollection.find({ roomId: membership ? membership.roomId : "" }).fetch(),
        players = _.map( allMemberships, function(ele){
          return ele.owner;
        }),
        result = null;

    if(membership) {
      result = GameCollection.insert({
        game: new Game({
          creator: this.userId,
          initPlayers: players,
          options: {}
        })
      });
    }

    return result;
  },

  handleGameAction: function(action) {
    action.game = action.gameId;
    action.playerId = this.userId;
    GameActions.insert( action );
  }
});
