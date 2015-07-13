var mainFilterInput = "xCard.cardList.filterString",
    getAllUserCards = function() {
      var result = CardOwnershipCollection.find().fetch();

      // Populate the card for each ownership entry
      result = _.map(result, function(ele) {
        return new CardModel( CardsCollection.findOne( ele["cardId"] ) );
      });

      /* Remove any entries where the card could not be loaded
      // TODO: Find a better way to do this?
      result = _.filter( result, function(ele) {
        return !_.isUndefined( ele["card"].title );
      });
      */

      return xCard.helpers.groupCards( result );
    }



// ALL CARDS
Template.allCards.events({
  "click button.report": function(card) {
		console.log( this );
	},

	"click button.acquire": function() {
    this.acquireCard();
	},

	"click button.delete": function() {
    this.deleteCard();
	},

	"keyup input.filter": function(e) {
		Session.set( mainFilterInput, e.currentTarget.value );
	}
});

Template.allCards.helpers({

  cards: function() {

    var filterRegex = RegExp(".*" + (Session.get(mainFilterInput)||"") + ".*","gi"),
        result = [],
        options = { sort: { title: 1 } };

    result = CardsCollection.find( { title: { $regex: filterRegex }}, options).fetch();

    // Create a CardModel from each result of the query
    result = result.map( function(ele){ return new CardModel(ele); });

    return result;
  }
});

// USER CARDS
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

// EDIT DECK CARDS
Template.editDeckCards.events({
  "click .addToDeck": function() {
    this.deck.removeCard( this );
  },

  "click .removeFromDeck": function() {
    if( this.deck ) {
      this.deck.addCard( this );
    }
  }
});

Template.editDeckCards.helpers({
  cards: function() {
    var result = getAllUserCards(),
        deck = this.deck;

    // Add the deck model to each card. This is to allow cards to reference a deck
    // without having to pull and unpack the deck from a collection
    result = _.map( result, function(ele) {
      ele.deck = deck;
      return ele;
    });

    return result;
  }
});

// DECK CARDS
Template.deckCards.helpers({
  groupCards: function(){
    return xCard.helpers.groupCards( this.cards );
  }
});
