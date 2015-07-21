var userFilterInput = "xCard.cardList.userFilterString";

Template.userCards.events({
		"click button.remove": function() {
			Meteor.call( "removeCard", this._id );
		},

    "keyup input.filter": function(e) {
      Session.set(userFilterInput, e.currentTarget.value);
    }
});

Template.userCards.helpers({
		cards: function() {
      return xCard.helpers.getAllUserCards(Session.get(userFilterInput));
		},

    filterValue: function() {
      return Session.get(userFilterInput) || "";
    }
});
