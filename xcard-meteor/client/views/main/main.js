Template.mainPage.events({
	"click button" : function(e) {
		var val = xCard.Session.get("main.helloCounter");

		if( _.isNumber(val) ) {
			xCard.Session.set( "main.helloCounter", val+1 );
		}
	}
});

Template.mainPage.helpers({
	helloCounter : function() {
		return xCard.Session.get( "main.helloCounter" );
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
	xCard.Session.set( "main.helloCounter", 0 );
}
