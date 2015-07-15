// Route all requests to the pageLoader template
Router.map( function(){
	this.route( "pageLoader", {
		path: /\/.*/
	});
});

// Add the valid pages for the client application
xCard.validPages = [ "home", "deck", "rooms" ];
xCard.defaultPage = xCard.validPages[0];

document.title = "xCard Card Game";
