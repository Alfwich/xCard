
xCard.session.currentGameId = "xCard.game.currentGameId";

Template.gamesPage.events({
  "click .newGame": function(){
    Meteor.call( "createGame", function(err,result){
    });
  },

  "click .enterGame": function() {
    Session.set( xCard.session.currentGameId, this._id );
    xCard.PageLoader.loadPage( "game" );
  }
});

Template.gamesPage.helpers({
  games: function() {
    return GameCollection.find().fetch();
  }

});
