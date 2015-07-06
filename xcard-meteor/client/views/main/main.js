(function(){
	var formatCardData = function()
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
					cards = CardModel.find();

			if( cards ) {
				result = cards.fetch();
			}

			return result;
		}
	});

	Template.mainPage.rendered = function() {
		xCard.Session.set( "main.helloCounter", 0 );
	}
})();
