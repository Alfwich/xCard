(function(){

	Template.mainPage.events({
	});

	Template.mainPage.helpers({
		numberOfCards: function() {
			return CardsCollection.find().count();
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
