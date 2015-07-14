
Template.userPanel.events({
	"click .addNewDeck": function() {
		Meteor.call( "newDeck" );
	}
});

Template.userDecks.events({
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

Template.userDecks.helpers({
	ownedDecks: function() {
		var result = UserDeckCollection.find().fetch();
		result = _.map(result, function(ele){ return new DeckModel(ele); } );
		return result;
	}
})
