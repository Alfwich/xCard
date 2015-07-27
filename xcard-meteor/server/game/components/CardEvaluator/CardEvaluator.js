// CardEvaluator.js: Will evaluate a card within a given game and apply the side-effects of the card
CardEvaluator = function() {
  this.cards = {}
}

CardEvaluator.prototype.registerCard = function( cardName, actions ) {
  this.cards[cardName] = actions;
}

CardEvaluator.prototype.applyCard = function( card, action ) {
  var cardAction = this.cards[card.title],
      result = null;

  action.game.addGlobalGameMessage( action.requestingPlayer.playerName + " casted card '" + card.title + "'" );

  if( cardAction ) {
    result = cardAction( action );
  }

  return result;
}
