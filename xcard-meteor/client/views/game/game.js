Template.gamePage.events({
  "click .selectDeck": function() {
    Meteor.call( "handleGameAction", {
      type: "select-deck",
      deckId: UserDeckCollection.findOne()._id
    }, this._id, function(){
      console.log( arguments);
    });
  }
});

Template.gamePage.helpers({
  gameData: function() {
    var gameId = Session.get( xCard.session.currentGameId ),
        game = GameCollection.findOne( gameId );
    console.log( gameId, game );
    return game;
  },

  players: function() {
    var result = _.map(this.game.players, function(ele){ return ele; } );
    return result;
  },

  playerCards: function() {

    var result = {};

    if( this.game ) {
      // Find the correct player
      var playerGameId = this.game.playersMap[Meteor.userId()],
          player = this.game.players[playerGameId];

      result["cards"] = _.map( player.hand, function(ele){ return new CardModel( CardCollection.findOne( ""+ele) ); } );
      console.log( result );

    }

    return result;
  }
});

Template.gamePage.rendered = function() {
  if( _.isUndefined(Session.get(xCard.session.currentGameId)) ) {
    xCard.PageLoader.loadPage( xCard.defaultPage );
  }
}
