
Template.mainPage.helpers({

	numberOfCards: function() {
		return CardsCollection.find().count();
	}

});
