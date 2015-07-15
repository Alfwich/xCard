xCard.session.currentRoomId = "xCard.rooms.currentRoomId";

Template.roomsPage.events({
  "click .addNewRoom": function() {
    Meteor.call( "createRoom", prompt( "Please enter Room name") );
  },

  "click .room": function() {
    this.joinRoom();
  },

  "keyup .chatInput": function(e) {
    if( e.keyCode == 13 || e.keyCode == 10 ) {
      this.sendChatMessage( e.currentTarget.value );
      e.currentTarget.value = "";
      e.preventDefault();
    }
  }
});

Template.roomsPage.helpers({
  rooms: function() {
    var result = RoomCollection.find().fetch();

    result = _.map( result, function(ele) {
      return new RoomModel(ele);
    });

    return result;
  },

  roomData: function() {
    var roomMembership = RoomMembership.findOne(),
        result = {};

    if( roomMembership ) {
      result = new RoomModel(RoomCollection.findOne(roomMembership.roomId))
      Session.set(xCard.session.currentRoomId, result._id);

      // Subscribe to the rooms chat
      Meteor.subscribe("roomChat", result._id);
    }

    return result;
  },

  chatLines: function() {
    var result = RoomChat.find().fetch();
    return result;
  }
});

// Add observer for the RoomChat to scroll the chat div to the bottom when
// a new message is recieved. We wrap the scroll in a timeout to allow Meteor
// to update the view. The timeout handle is cached to allow us to only call the
// scroll code exactly once for frequent updates.
var scrollTimeoutHandle = null;
RoomChat.find().observe({
    added: function(ele) {
      clearTimeout( scrollTimeoutHandle );
      scrollTimeoutHandle = setTimeout(function(){
        var chatDiv = document.getElementById("chat");
        chatDiv.scrollTop = chatDiv.scrollHeight;
      }, 50 );
    }
});
