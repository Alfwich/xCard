Template.registerHelper( "allCards", function(filterId) {
  var filterText = Session.get( xCard.session.filterPrefix + filterId ),
      filterRegex = RegExp(".*" + (filterText||"") + ".*","gi"),
      allCards = CardCollection.find({ title: { $regex: filterRegex }},{sort:{title:1}}).fetch();

  return {
    cards: _.map(allCards,function(ele){ return new CardModel(ele); })
  }
});

Template.registerHelper( "userCards", function(filterId) {
  return {
    cards: xCard.helpers.getAllUserCards(Session.get(xCard.session.filterPrefix + filterId))
  };
})
