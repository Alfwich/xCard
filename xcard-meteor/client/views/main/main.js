(function(){
	var mainCounterName = "main.helloCounter";

	Template.mainPage.events({
		"click button" : function(e) {
			var val = xCard.Session.get(mainCounterName);

			if( _.isNumber(val) ) {
				xCard.Session.set( mainCounterName, val+1 );
			}
		}
	});

	Template.mainPage.helpers({
		helloCounter : function() {
			return xCard.Session.get(mainCounterName);
		},

		cards: function() {
			var result = [],
					cards = CardsCollection.find();

			if( cards.count() ) {
				// Create an array of Card objects from the result of the cards query
				result = cards.fetch().map( function(ele){ return new CardModel(ele); });
			}

			return result;
		}
	});

	Template.mainPage.rendered = function() {
		xCard.Session.set(mainCounterName, 0 );
	}
})();
