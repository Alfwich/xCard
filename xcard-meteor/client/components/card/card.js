Template.card.events({
	"click button.report": function() {
		console.log( this );
	}
})

Template.card.helpers({
	head : function() {
		return this.title || "no title";
	},

	body : function(){
		return this.body || "no body";
	}
});

Template.card.rendered = function(){
}
