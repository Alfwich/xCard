// Allow the client to see all of the card data
Meteor.publish( "cardData" , function() {
	return CardCollection.find();
});

Meteor.publish( "cardOwnership", function() {
	return CardOwnershipCollection.find({ owner: this.userId });
});

Meteor.publish( "userDecks", function() {
	return UserDeckCollection.find({ owner: this.userId });
});

Meteor.publish( "allRooms", function() {
	return RoomCollection.find();
});

Meteor.publish( "roomMembership", function() {
	return RoomMembership.find({ owner: this.userId });
});
