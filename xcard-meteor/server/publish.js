// Allow the client to see all of the card data
Meteor.publish( "cardData" , function() {
	return CardsCollection.find();
});

Meteor.publish( "cardOwnership", function() {
	return CardOwnershipCollection.find( { owner: this.userId } );
});

// TODO: Create a publification that returns the current user-owned cards
