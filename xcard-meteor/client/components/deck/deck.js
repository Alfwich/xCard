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
    this.changeName(prompt("Please enter new name"));
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
