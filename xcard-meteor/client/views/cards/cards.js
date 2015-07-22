
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
