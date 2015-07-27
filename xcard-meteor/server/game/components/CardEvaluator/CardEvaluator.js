// CardEvaluator.js: Will evaluate a card within a given game and apply the side-effects of the card
CardEvaluator = function() {
  this.cards = {}
}

CardEvaluator.prototype.registerCard = function( cardName, actions ) {
  this.cards[cardName] = actions;
}

CardEvaluator.prototype.applyCard = function( card, action, state ) {
  var cardAction = this.cards[card.title],
      result = null;
      
  if( cardAction, state ) {
    state.callMethod( "addGlobalGameMessage", action.requestingPlayer.playerName + " casted card '" + card.title + "'" );
    result = cardAction( action, state );
  }

  return result;
}
