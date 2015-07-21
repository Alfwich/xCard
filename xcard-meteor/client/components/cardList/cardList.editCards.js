var editFilterInput = "xCard.cardList.editFilterString";

// EDIT DECK CARDS
Template.editDeckCards.events({
  "keyup input.filter": function(e) {
    Session.set(editFilterInput, e.currentTarget.value);
  }
});
