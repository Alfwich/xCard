// Route all requests to the pageLoader template
Router.map( function(){
	this.route( "pageLoader", {
		path: /\/.*/
	});
});

// Add the valid pages for the client application
xCard.validPages = [ "main", "deck" ];
xCard.defaultPage = "main";
