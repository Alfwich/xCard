
var getPlayer = function( game ) {
  return game.players[game.playerGameId];
}

var getPlayerAttribute = function(game, attr, def) {
  var player = getPlayer( game ),
      result = def;

  if( player && !_.isUndefined( player[attr] ) ) {
    result = player[attr];
  }

  return result;
}

Template.useGameCard.events({
  "click button": function(e) {
    Meteor.call( "handleGameAction", {
        type: "use-card",
        cardId: this.data._id
      },
      Session.get( xCard.session.currentGameId )
    );
  }
})

Template.gamePage.events({
  "click .selectDeck": function() {
    Meteor.call( "handleGameAction", {
      type: "select-deck",
      deckId: UserDeckCollection.findOne()._id
    }, this._id, function(){
      console.log( arguments);
    });
  }
});

Template.selectGameDeck.helpers({
  ownedDecks: function() {
    var result = UserDeckCollection.find( { owner: Meteor.userId() } ).fetch();
    result = _.map( result, function(ele){ return new DeckModel(ele); });
    return { decks: result };
  }
})

Template.gamePage.helpers({
  gameData: function() {
    var gameId = Session.get( xCard.session.currentGameId ),
        gameContainer = GameCollection.findOne( gameId );

    if( gameContainer ) {
      gameContainer.game.playerGameId = gameContainer.game.playersMap[Meteor.userId()];
      gameContainer.game.isActivePlayer = gameContainer.game.playerGameId == gameContainer.game.state.activePlayer;
      console.log( gameContainer );
    }

    return gameContainer;
  },



  isActivePlayer: function() {
    return this.game.isActivePlayer ? "active" : "";
  },

  playerHealth: function() {
    return getPlayerAttribute( this.game, "health", 0 );
  },

  playerCurrentMana: function() {
    return getPlayerAttribute( this.game, "mana", 0 );
  },

  playerMaxMana: function() {
    return getPlayerAttribute( this.game, "maxMana", 0 );
  },

  playerDeck: function() {
    return getPlayerAttribute( this.game, "deck", [] ).length + " cards in deck";
  },

  playerExile: function() {
    return getPlayerAttribute( this.game, "exile", [] ).length + " cards in exile";
  },

  playerDiscard: function() {
    return getPlayerAttribute( this.game, "discard", [] ).length + " cards in discard";
  },

  playerCards: function() {
    var result = {};

    if( this.game ) {
      // Find the correct player
      var player = this.game.players[this.game.playerGameId];
      result["cards"] = _.map( player.hand, function(ele){ return new CardModel( CardCollection.findOne( ""+ele) ); } );
    }

    return result;
  }
});

Template.gamePlayers.helpers({
  players: function() {
    var result = _.map(this.game.players, function(ele){
      return {
        player: ele,
        isActive: this.game.state.activePlayer == this.game.playersMap[ele.playerId] ? "isActive" : ""
      };
    }.bind(this));
    return result;
  },
});

Template.gamePage.rendered = function() {
  if( _.isUndefined(Session.get(xCard.session.currentGameId)) ) {
    xCard.PageLoader.loadPage( xCard.defaultPage );
  }
}

var scrollTimeoutHandle = null,
    scrollGameStateToBottom = function() {
      clearTimeout( scrollTimeoutHandle );
      scrollTimeoutHandle = setTimeout(function(){
        var chatDiv = document.getElementById("gameStateOutput");
        if( chatDiv ) {
          chatDiv.scrollTop = chatDiv.scrollHeight;
        }
      }, 50 );
    };

// Add observer for the RoomChat to scroll the chat div to the bottom when
// a new message is recieved. We wrap the scroll in a timeout to allow Meteor
// to update the view. The timeout handle is cached to allow us to only call the
// scroll code exactly once for frequent updates.
GameCollection.find().observe({
    changed: function(from,to) {
      scrollGameStateToBottom();
    },
});
