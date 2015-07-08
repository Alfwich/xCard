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

		"click button.remove": function() {
			Meteor.call( "removeCard", this._id );
		},

		"keyup input.filter": function(e) {
			Session.set( mainFilterInput, e.currentTarget.value );
		}

	});

	Template.mainPage.helpers({

		numberOfCards: function() {
			return CardsCollection.find().count();
		},

		ownedCards: function() {
			var result = CardOwnershipCollection.find().fetch();

			// Populate the card for each ownership entry
			result = _.forEach(result, function(ele) {
				ele.card = new CardModel( CardsCollection.findOne( ele["cardId"] ) );
			});

			// Remove any entries where the card could not be loaded
			// TODO: Find a better way to do this?
			result = _.filter( result, function(ele) {
				return !_.isUndefined( ele["card"].title );
			});

			return result;
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
