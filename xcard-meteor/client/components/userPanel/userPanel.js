
Template.userPanel.events({
	"click .addNewDeck": function() {
		Meteor.call( "newDeck" );
	}
});

Template.userPanel.helpers({
});


Template.userCards.events({
		"click button.remove": function() {
			Meteor.call( "removeCard", this._id );
		},
});

Template.userCards.helpers({
		ownedCards: function() {
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
});

Template.userDecks.events({
	"click button.removeDeck": function() {
		if( confirm( "Are you sure you want to remove this deck?" ) ) {
			Meteor.call( "removeDeck", this._id );
		}
	},

	"click button.changeName": function() {
		var newName = prompt( "Please enter new name" );
		Meteor.call( "updateDeck", this._id, { name: newName } );
	}
})

Template.userDecks.helpers({
	ownedDecks: function() {
		var result = UserDecks.find().fetch();

		result = _.map(result, function(ele){ return new DeckModel(ele); } );

		return result;
	}
})
