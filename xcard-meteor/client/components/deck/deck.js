Template.deckOverview.helpers({
  name: function(){
    return this.name;
  },

  cards: function() {
    return this.cards;
  }
});

Template.deckDetailed.events({
  "click .renameDeck": function() {
    var newName = prompt("Please enter new name");

    if( newName ) {
      this.changeName(newName);
    }
  }
});
Template.deckDetailed.helpers({
  name: function(){
    return this.name;
  },

  cards: function() {
    return this.cards;
  }
});
