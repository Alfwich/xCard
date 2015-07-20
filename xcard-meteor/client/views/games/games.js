
Template.gamesPage.events({
  "click .newGame": function(){
    Meteor.call( "createGame", function(err,result){
    });
  },

  "click .useDeck": function() {
    Meteor.call( "handleGameAction", {
      type: "select-deck",
      deckId: UserDeckCollection.findOne()._id},
      this._id
    );
  }
});

Template.gamesPage.helpers({
  games: function() {
    return GameCollection.find().fetch();
  },

  playerData: function() {
    return _.map( this.players, function(ele){ return ele; } );
  }

});
