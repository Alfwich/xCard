
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

Template.gamePage.events({
  "click .selectDeck": function() {
    Meteor.call( "handleGameRequest", {
      type: "select-deck",
      deckId: this.data._id,
      gameId: Session.get( xCard.session.currentGameId )
    });
  },

  "click .gamePassTurn": function() {
    Meteor.call( "handleGameRequest", {
      type: "pass",
      gameId: Session.get( xCard.session.currentGameId )
    });
  },

  "click .useGameCard": function() {
    Meteor.call( "handleGameRequest", {
        type: "use-card",
        cardId: this.data._id,
        gameId: Session.get( xCard.session.currentGameId )
    });
  },

  "click .gameAddPlayerButton": function() {
    Meteor.call( "handleGameRequest", {
        type: "add-player",
        username: $(".gameAddPlayerInput").val(),
        gameId: Session.get( xCard.session.currentGameId )
    });
    $(".gameAddPlayerInput").val("");
  },

  "click .gameRemovePlayerButton": function() {
    Meteor.call( "handleGameRequest", {
        type: "remove-player",
        username: $(".gameAddPlayerInput").val(),
        gameId: Session.get( xCard.session.currentGameId )
    });
    $(".gameAddPlayerInput").val("");
  },

  "click .gameRestartButton": function() {
    Meteor.call( "handleGameRequest", {
        type: "restart",
        gameId: Session.get( xCard.session.currentGameId )
    });
  }
});

Template.selectGameDeck.helpers({
  ownedDecks: function() {
    var result = UserDeckCollection.find( { owner: Meteor.userId() } ).fetch();
    result = _.map( result, function(ele){ return new DeckModel(ele); });
    return { decks: result };
  },

  isInvlovedInGame: function() {
    return this.game.playersMap[Meteor.userId()];
  }
})

Template.gamePlayersPanel.helpers({
  isCreator: function() {
    return this.game.creator == Meteor.userId();
  }
});

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

  playerAttribute: function(attr) {
    return getPlayerAttribute( this.game, attr, "" );
  },

  playerZoneCount: function( zone ) {
    return getPlayerAttribute( this.game, zone, [] ).length;
  },

  handCards: function() {
    var result = { cards:[] };

    if( this.game ) {
      result.cards = _.map( getPlayerAttribute( this.game, "hand", [] ),
        function(ele){
          return new CardModel( CardCollection.findOne( ""+ele) );
      });
    }

    return result;
  },

  isCreator: function() {
    return this.game.creator == Meteor.userId();
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

Template.gameMessages.helpers({
  isSystemMessage: function() {
    if( _.isString(this) ) {
      return this.indexOf( "###SYSTEM" ) != -1 ? "system" : "";
    }
  }
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
