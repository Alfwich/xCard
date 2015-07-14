Meteor.methods({
  newDeck: function() {
    if( Meteor.userId() ) {
      UserDeckCollection.insert( { owner: Meteor.userId(), cards: {}, name: "New Deck" } );
    }
  },

  removeDeck: function(deckId) {
    if( deckId ) {
      UserDeckCollection.remove(deckId);
    }
  },

  updateDeck: function(deckId, updateFields) {
    if( deckId && updateFields ) {
      UserDeckCollection.update( deckId, { $set: updateFields } );
    }
  },

  addCardToDeck: function(deckId, ownershipId) {
    var deck = UserDeckCollection.findOne(deckId),
        ownership = CardOwnershipCollection.findOne( ownershipId );

    if( deck && ownership ) {
      var deckOwnership = deck.cards[ownership._id];
      if( deckOwnership ) {
          // Only add the card if we have available cards to add
          if( deckOwnership.count < ownership.count ) {
            deckOwnership.count++;
          }
      } else {
        deckOwnership = { ownershipId: ownership._id, count: 1 };
      }

      deck.cards[ownership._id] = deckOwnership;
      UserDeckCollection.update( deck._id, { $set: { cards: deck.cards } } );
    }
  },

  removeCardFromDeck: function(deckId, ownershipId) {

    var deck = UserDeckCollection.findOne(deckId),
        ownership = CardOwnershipCollection.findOne( ownershipId );

    if( deck && ownership ) {
      var deckOwnership = deck.cards[ownership._id];
      if( deckOwnership ) {
          // Only add the card if we have available cards to add
          if( deckOwnership.count > 0 ) {
            deckOwnership.count--;
          }
          
          if( deckOwnership.count ) {
            deck.cards[ownership._id] = deckOwnership;
          } else {
            delete deck.cards[ownership._id];
          }

          UserDeckCollection.update( deck._id, { $set: { cards: deck.cards } } );
      }


    }
  }
});
