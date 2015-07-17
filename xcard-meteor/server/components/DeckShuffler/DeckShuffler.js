// Returns an array of cardIds for a provided deck. The length of the array
// will be the number of cards in the deck. The order of the cardIds are randomly
// generated to simulate a random shuffle of the deck's cards.
DeckShuffler = function(deck) {
  var result = [];

  if(deck) {
    var cardIds = _.map(deck.cards, function(ele){
        var ownership = CardOwnershipCollection.findOne( ele.ownershipId );

        if(ownership) {
          var card = CardCollection.findOne( ownership.cardId )

          if(card) {
            // Add the number of cards to the array equal to the number of cards
            // of this type in the deck
            for( var i = 0; i < ele.count; i++ ) {
              result.push(""+card._id);
            }
          }
        }
    });
  }

  return _.shuffle(result);
}
