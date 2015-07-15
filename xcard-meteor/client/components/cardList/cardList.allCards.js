var mainFilterInput = "xCard.cardList.filterString";

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

    // TODO: Refactor. This functionality should be factored into its own method
    if( this.disableFilter ) {
      filterRegex = RegExp(".*", "gi");
    }

    result = CardCollection.find( { title: { $regex: filterRegex }}, options).fetch();

    // Create a CardModel from each result of the query
    result = _(result).filter( function(ele) {
      return !_.isUndefined( ele.title );
    }).map( function(ele){
      return new CardModel(ele);
    }).value();

    if( !this.disableFilter ) {
      Session.set( xCard.session.filteredCardsCount, result.length );
    }

    return result;
  },

  filterValue: function() {
    return Session.get(mainFilterInput)||"";
  }
});
