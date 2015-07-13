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
