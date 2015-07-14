xCard.session.filteredCardsCount = "xCard.home.filteredCards";

Template.homePage.helpers({

	numberOfCards: function() {
		return Session.get(xCard.session.filteredCardsCount) || CardCollection.find().count();
	},

	filterText: function() {
		var result = "Filtered"

		if( Session.get(xCard.session.filteredCardsCount) == CardCollection.find().count() ) {
			result = "All Cards";
		}

		return result;
	}

});
