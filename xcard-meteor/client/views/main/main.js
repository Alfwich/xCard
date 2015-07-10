(function(){

	Template.mainPage.events({
	});

	Template.mainPage.helpers({

		numberOfCards: function() {
			return CardsCollection.find().count();
		}

	});

	Template.mainPage.rendered = function() {
	}
})();
