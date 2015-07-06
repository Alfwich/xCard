// Route all requests to the pageLoader template
Router.map( function(){
	this.route( "pageLoader", {
		path: /\/.*/
	});
});
