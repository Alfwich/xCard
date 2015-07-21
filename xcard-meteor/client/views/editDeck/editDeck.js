
xCard.session.deckPageLoad = "xCard.editDeck.deckPageLoad";

Template.editDeckPage.events({
  "click .editDeckCard": function() {
    if( this.data ) {
      this.data.deck.removeCard( this.data );
    }
  },

  "click .editDeckUserCard": function() {
    if( this.data ) {
      this.data.deck.addCard( this.data );
    }
  },

  "click .deckName": function() {
    var newName = prompt( "Please enter new deck name" );
    if( newName && this.deck ) {
      this.deck.changeName( newName );
    }
  }
});

Template.editDeckPage.helpers({
  loadDeck: function(){
    var deck = UserDeckCollection.findOne( Session.get( xCard.session.deckPageLoad ) ),
        result = null;

    if( deck ) {
      result = new DeckModel( deck );
    } else {
      xCard.PageLoader.loadPage( "home" );
    }

    return { deck: result };
  },

  userCards: function() {
    var result = [];

    if( this.deck ) {
      result = _.map( xCard.helpers.getAllUserCards(), function(ele) {
        ele.deck = this.deck;
        return ele;
      }.bind(this));
    }

    return { cards: result };
  }
});
