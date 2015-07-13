var mainFilterInput = "xCard.cardList.filterString"
Session.set( mainFilterInput, "" );

var getAllUserCards = function(){
  var result = CardOwnershipCollection.find().fetch();

  // Populate the card for each ownership entry
  result = _.forEach(result, function(ele) {
    ele.card = new CardModel( CardsCollection.findOne( ele["cardId"] ) );
  });

  // Remove any entries where the card could not be loaded
  // TODO: Find a better way to do this?
  result = _.filter( result, function(ele) {
    return !_.isUndefined( ele["card"].title );
  });

  return result;
}

Template.userCards.events({
		"click button.remove": function() {
			Meteor.call( "removeCard", this._id );
		},
});

Template.userCards.helpers({
		cards: function() {
      return getAllUserCards();
		}
});

Template.allCards.events({
  "click button.report": function(card) {
		console.log( this );
	},

	"click button.acquire": function() {
		Meteor.call( "acquireCard", this._id );
	},

	"click button.delete": function() {
		Meteor.call( "deleteCard", this._id );
	},

	"keyup input.filter": function(e) {
		Session.set( mainFilterInput, e.currentTarget.value );
	}
});

Template.allCards.helpers({

  cards: function() {

    var filterRegex = RegExp(".*" + Session.get( mainFilterInput ) + ".*","gi"),
        result = [],
        options = { sort: { title: 1 } };

    result = CardsCollection.find( { title: { $regex: filterRegex }}, options).fetch();

    // Create a CardModel from each result of the query
    result = result.map( function(ele){ return new CardModel(ele); });

    return result;
  }
});

Template.editDeckCards.events({
  "click .addToDeck": function(){
    Meteor.call( "addCardToDeck", Session.get(xCard.session.deckPageLoad), this._id );
  },

  "click .removeFromDeck": function() {
    Meteor.call( "removeCardFromDeck", Session.get(xCard.session.deckPageLoad), this._id );
  }
});

Template.editDeckCards.helpers({
  cards: function() {
    var result = getAllUserCards(),
        ownershipIds = _.map( this.deck.cards, function(ele){
          return ele.ownershipId;
        });

    result = _.map( result, function(ele) {
      if( _.contains( ownershipIds, ele._id) ) {
        ele.exists = true
      };
      return ele;
    });

    return result;
  }
});
