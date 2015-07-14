xCard.session.filteredCardsCount = "xCard.main.filteredCards";

Template.mainPage.helpers({

	numberOfCards: function() {
		return Session.get(xCard.session.filteredCardsCount) || CardsCollection.find().count();
	},

	filterText: function() {
		var result = "Filtered"

		if( Session.get(xCard.session.filteredCardsCount) == CardsCollection.find().count() ) {
			result = "All Cards";
		}

		return result;
	}

});
