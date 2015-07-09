Meteor.methods({
  // CARDS
  deleteCard: function(id) {
    if( id ) {
      CardsCollection.remove(id);
    }
  },

  acquireCard: function(cardId) {
    if( Meteor.userId() && cardId ) {
      CardOwnershipCollection.insert({ owner: Meteor.userId(), cardId: cardId});
    }
  },

  removeCard: function(ownershipId) {
    if( ownershipId ) {
      CardOwnershipCollection.remove( ownershipId );
    }
  },

  // DECKS
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
  }
});
