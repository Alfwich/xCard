Template.card.events({
})

Template.card.helpers({
	head : function() {
		return this.title|| "no title";
	},

	body : function(){
		return this.body || "no body";
	}
});

Template.card.rendered = function(){
}
