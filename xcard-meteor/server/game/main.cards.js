xCard.cardEvaluator.registerCard( "Dead At The Mist", function( game, action ) {
  game.addGlobalGameMessage( action.player.playerName + " breathed in death at the mist!" ); 
  game.modifyPlayerValue( action.playerGameId, "health", -1 );
  return true;
});
