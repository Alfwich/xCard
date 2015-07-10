
Template.userPanel.events({
	"click .addNewDeck": function() {
		Meteor.call( "newDeck" );
	}
});

Template.userPanel.helpers({
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
