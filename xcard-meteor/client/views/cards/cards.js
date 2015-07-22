
Template.cardsPage.events({
  "click .removeOwnedCard": function() {
    if( this.data ) {
      this.data.removeCard();
    }
  },

  "click .acquireCard": function() {
    if( this.data ) {
      this.data.acquireCard();
    }
  },

  "click button.reportCard": function(card) {
    if( this.data ) {
      console.log( this );
    }
  },

  "click button.deleteCard": function() {
    if( this.data ) {
      this.data.deleteCard();
    }
  },
});

Template.cardsPage.helpers({
  "allCards": function() {
    var allCards = CardCollection.find({},{sort:{title:1}}).fetch();
    return {
      cards: _.map(allCards,function(ele){ return new CardModel(ele); })
    }
  },

  "userCards": function() {
    return {
      cards: xCard.helpers.getAllUserCards()
    };
  }
})
