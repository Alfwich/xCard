
Template.decksPage.events({
	"click .addNewDeck": function() {
		Meteor.call( "newDeck", function( err, deckId) {
			Session.set( xCard.session.deckPageLoad, deckId );
			xCard.PageLoader.loadPage( "deck" );
		});
	}
});

Template.decksPage.events({
	"click button.removeDeck": function(e) {
		if( confirm( "Are you sure you want to remove this deck?" ) ) {
			this.removeDeck();
		}
		
		e.stopPropagation()
	},

	"click .editDeck": function() {
		Session.set( xCard.session.deckPageLoad, this._id );
		xCard.PageLoader.loadPage( "deck" );
	}

})

Template.decksPage.helpers({
	ownedDecks: function() {
		var result = UserDeckCollection.find().fetch();
		result = _.map(result, function(ele){ return new DeckModel(ele); } );
		return result;
	}
})
