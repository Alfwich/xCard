
Template.decksPage.events({
	"click .addNewDeck": function() {
		if(Meteor.userId()) {
			Meteor.call( "newDeck", function( err, deckId) {
				Session.set( xCard.session.deckPageLoad, deckId );
				xCard.PageLoader.loadPage( "editDeck" );
			});
		}
	},

	"click div.userDeck": function() {
		if( this.data ) {
			Session.set( xCard.session.deckPageLoad, this.data._id );
			xCard.PageLoader.loadPage( "editDeck" );
		}
	},

	"click button.removeDeck": function(e) {
		if( confirm( "Are you sure you want to remove this deck?" ) ) {
			this.data.removeDeck();
		}

		e.stopPropagation()
	}
});

Template.decksPage.helpers({
	userDecks: function() {
		var result = UserDeckCollection.find().fetch();
		result = _.map(result, function(ele){ return new DeckModel(ele); } );
		return { decks: result };
	}
})
