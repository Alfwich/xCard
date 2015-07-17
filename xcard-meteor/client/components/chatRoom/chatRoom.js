
var scrollTimeoutHandle = null;
    scrollChatToBottom = function() {
      clearTimeout( scrollTimeoutHandle );
      scrollTimeoutHandle = setTimeout(function(){
        var chatDiv = document.getElementById("chat");
        if( chatDiv ) {
          chatDiv.scrollTop = chatDiv.scrollHeight;
        }
      }, 50 );
    }

Template.chatRoom.helpers({
  chatLines: function() {
    var result = RoomChatCollection.find({ roomId: this.room._id }).fetch();
    return result;
  },

  users: function() {
    return this.room.users;
  }

});

Template.chatRoom.events({
  "keyup .chatInput": function(e) {
    if((e.keyCode == 13 || e.keyCode == 10) && this.room) {
      this.room.sendChatMessage(e.currentTarget.value);
      e.currentTarget.value = "";
      e.preventDefault();
    }
  }
});

Template.chatRoom.rendered = function() {
  scrollChatToBottom();
}

// Add observer for the RoomChat to scroll the chat div to the bottom when
// a new message is recieved. We wrap the scroll in a timeout to allow Meteor
// to update the view. The timeout handle is cached to allow us to only call the
// scroll code exactly once for frequent updates.
RoomChatCollection.find().observe({
    added: function(ele) {
      scrollChatToBottom();
    }
});
