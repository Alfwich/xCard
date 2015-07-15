
Template.decksPage.events({
	"click .addNewDeck": function() {
		Meteor.call( "newDeck" );
	}
});

Template.decksPage.events({
	"click button.removeDeck": function() {
		if( confirm( "Are you sure you want to remove this deck?" ) ) {
			this.removeDeck();
		}
	},

	"click button.editDeck": function() {
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
