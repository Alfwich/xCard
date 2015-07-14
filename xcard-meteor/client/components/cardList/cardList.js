var mainFilterInput = "xCard.cardList.filterString",
    userFilterInput = "xCard.cardList.userFilterString",
    editFilterInput = "xCard.cardList.editFilterString",
    getAllUserCards = function(filterString) {
      var result = CardOwnershipCollection.find({}).fetch(),
          filterRegex = RegExp(".*" + (filterString||"") + ".*","gi");

      // Populate the card for each ownership entry
      result = _(result).map( function(ele) {
        var card = new CardModel( CardsCollection.findOne( { _id: ele["cardId"], title: {$regex: filterRegex } } ) );
        card.count = ele.count;
        return card;
      }).filter( function(ele) {
        return ele.title.length;
      }).value();

      return result;
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
    result = _(result).filter( function(ele) {
      return !_.isUndefined( ele.title );
    }).map( function(ele){
      return new CardModel(ele);
    }).value();

    Session.set( xCard.session.filteredCardsCount, result.length );

    return result;
  }
});

// USER CARDS
Template.userCards.events({
		"click button.remove": function() {
			Meteor.call( "removeCard", this._id );
		},

    "keyup input.filter": function(e) {
      Session.set(userFilterInput, e.currentTarget.value);
    }
});

Template.userCards.helpers({
		cards: function() {
      return getAllUserCards(Session.get(userFilterInput));
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
  },

  "keyup input.filter": function(e) {
    Session.set(editFilterInput, e.currentTarget.value);
  }
});

Template.editDeckCards.helpers({
  cards: function() {
    var result = getAllUserCards(Session.get(editFilterInput)),
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
});
