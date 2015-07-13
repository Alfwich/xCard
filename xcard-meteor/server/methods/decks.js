Meteor.methods({
  newDeck: function() {
    if( Meteor.userId() ) {
      UserDecks.insert( { owner: Meteor.userId(), cards: [], name: "New Deck" });
    }
  },

  removeDeck: function(deckId) {
    if( deckId ) {
      UserDecks.remove(deckId);
    }
  },

  updateDeck: function(deckId, updateFields) {
    if( deckId && updateFields ) {
      UserDecks.update( deckId, { $set: updateFields } );
    }
  },

  addCardToDeck: function(deckId, ownershipId) {
    var deck = UserDecks.findOne(deckId),
        ownership = CardOwnershipCollection.findOne( ownershipId );

    if( deck && ownership ) {
      deck.cards.push( ownership._id );
      deck.cards = _.uniq( deck.cards );
      UserDecks.update( deck._id, { $set: { cards: deck.cards } } );
    }
  },

  removeCardFromDeck: function(deckId, ownershipId) {
    var deck = UserDecks.findOne(deckId);

    if( deck ) {
      var index = deck.cards.indexOf(ownershipId);
      if( index > -1 ) {
        deck.cards.splice(index,1);
        UserDecks.update( deck._id, { $set: { cards: deck.cards } } );
      }
    }
  }
});
