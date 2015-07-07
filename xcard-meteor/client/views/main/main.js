(function(){

	Template.mainPage.events({
	});

	Template.mainPage.helpers({
		numberOfCards: function() {
			return CardsCollection.find().count();
		},

		ownedCards: function() {
			var ownedCards = CardOwnershipCollection.find().fetch();
			// Get all of the cards which have an id in the array of owned card ids
			// TODO: How will we model multiple cards?
			var result = CardsCollection.find( { _id: { $in: _.pluck(ownedCards,"cardId") } }, { sort: { title: 1 } }  ).fetch();
			return result;
		},

		cards: function() {
			var result = CardsCollection.find({},{ sort: { title: 1 } }).fetch();

			// Create a CardModel from each result of the query
			result = result.map( function(ele){ return new CardModel(ele); });
			return result;
		}
	});

	Template.mainPage.rendered = function() {
	}
})();
