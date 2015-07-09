(function(){

	var mainFilterInput = "xCard.main.cardFilter";

	Session.set( mainFilterInput, "" );

	Template.mainPage.events({
		"click button.report": function(card) {
			console.log( this );
		},

		"click button.acquire": function() {
			Meteor.call( "acquireCard", this._id );
		},

		"click button.delete": function() {
			Meteor.call( "deleteCard", this._id );
		},

		"keyup input.filter": function(e) {
			Session.set( mainFilterInput, e.currentTarget.value );
		}

	});

	Template.mainPage.helpers({

		numberOfCards: function() {
			return CardsCollection.find().count();
		},

		cards: function() {
			var filterRegex = RegExp(".*" + Session.get( mainFilterInput ) + ".*","gi")
					result = [],
					options = { sort: { title: 1 } };

			result = CardsCollection.find( { title: { $regex: filterRegex }}, options).fetch();

			// Create a CardModel from each result of the query
			result = result.map( function(ele){ return new CardModel(ele); });

			return result;
		}
	});

	Template.mainPage.rendered = function() {
	}
})();
