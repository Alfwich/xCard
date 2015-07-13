Template.card.events({
	"click button.report": function() {
		console.log( this );
	},

	"click button.acquire": function() {
		Meteor.call( "acquireCard", Meteor.userId(), this._id );
	},

	"click button.delete": function() {
		Meteor.call( "deleteCard", this._id );
	}
})

Template.card.helpers({
	head : function() {
		return this.title;
	},

	body : function(){
		return this.body;
	}
});
