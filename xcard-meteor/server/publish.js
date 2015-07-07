// Allow the client to see all of the card data
Meteor.publish( "cardData" , function() {
	return CardsCollection.find();
});

Meteor.publish( "cardOwnership", function() {
	return CardOwnershipCollection.find();
});
