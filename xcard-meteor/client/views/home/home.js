Template.homePage.helpers({
  "allCards": function() {
    var allCards = CardCollection.find({},{sort:{title:1}}).fetch();
    return {
      cards: _.map(allCards,function(ele){ return new CardModel(ele); })
    }
  },  
})
