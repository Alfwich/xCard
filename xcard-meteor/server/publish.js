// Allow the client to see all of the card data
Meteor.publish( "cardData" , function() {
	return CardsCollection.find();
})
