Template.gamesPage.helpers({
  games: function() {
    return GameCollection.find().fetch();
  }
});
