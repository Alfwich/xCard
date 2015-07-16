var editFilterInput = "xCard.cardList.editFilterString";

// EDIT DECK CARDS
Template.editDeckCards.events({
  "click .addToDeck": function() {
    this.deck.addCard( this );
  },

  "keyup input.filter": function(e) {
    Session.set(editFilterInput, e.currentTarget.value);
  }
});

Template.editDeckCards.helpers({
  
  cards: function() {
    var result = xCard.helpers.getAllUserCards(Session.get(editFilterInput)),
        deck = this.deck;

    // Add the deck model to each card. This is to allow cards to reference a deck
    // without having to pull and unpack the deck from a collection
    result = _.map( result, function(ele) {
      ele.deck = deck;
      return ele;
    });

    return result;
  },

  filterValue: function() {
    return Session.get(editFilterInput) || "";
  }
});
