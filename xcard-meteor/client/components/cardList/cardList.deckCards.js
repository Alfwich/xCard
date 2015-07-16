Template.deckCards.events({
  "click .removeFromDeck": function(e) {
    this.deck.removeCard( this );
  }
});
