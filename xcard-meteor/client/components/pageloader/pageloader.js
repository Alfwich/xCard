Template.pageLoader.events( {
});

Template.pageLoader.helpers( {
  // Attempts to load the template provided by its name
  loadPage : function() {
    var page = Session.get("xCard.currentPage"),
        result = { template : Template["mainPage"] }

    if( _.isString(page) && Template[page] !== undefined ) {
      result.template = Template[page];
    }

    return result;
  }
});

Template.pageLoader.rendered = function() {
}
