// CardEvaluator.js: Will evaluate a card within a given game and apply the side-effects of the card
CardEvaluator = function() {
  this.cards = {}
}

CardEvaluator.prototype.registerCard = function( cardName, actions ) {
  this.cards[cardName] = actions;
}

CardEvaluator.prototype.applyCard = function( card, request, state ) {
  var action = this.cards[card.title];

  if( action && state ) {
    state.callMethod( "addGlobalGameMessage", request.requestingPlayer.playerName + " casted card '" + card.title + "'" );
    return action( request, state );
  }
}
