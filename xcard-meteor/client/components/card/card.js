
Template.singleCard.helpers({
	head : function() {
		return this.title;
	},

	imageSource: function() {
		return "test0" + _.random(1,9) + ".jpg";
	},

	body : function(){
		return this.body;
	}
});
