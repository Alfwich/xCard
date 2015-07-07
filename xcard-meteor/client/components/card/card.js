Template.card.events({
	"click button.report": function() {
		console.log( this );
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

Template.card.rendered = function(){
}
