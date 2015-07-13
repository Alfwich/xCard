
Template.pageLoader.helpers( {

  // Attempts to load the template provided by its name
  loadPage : function() {
    var page = Session.get("xCard.currentPage"),
        result = { template : Template[xCard.defaultPage + "Page"] }

    if( _.isString(page) && page.length && Template[page] !== undefined ) {
      result.template = Template[page];
    }

    return result;
  }
});
