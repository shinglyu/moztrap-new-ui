function parseQuery(query) {
  //var queries = query.split(" ");
  var re = /([^\s"']+"([^"]*)"|[^\s]+)/g;
  var results = query.match(re);
  var resultList = results.map(function(result) {
    var keyVal = result.split(":");
    if (keyVal.length < 2) {
      return {key:"", value:keyVal[0]};
    }
    else {
      return {key:keyVal[0], value:keyVal[1]};
    }
  });
  return resultList;
}

function queryCodegen(tokens) {
  return tokens.map(function(token){
    if (token.key == "") {
      return "name__icontains=" + token.value;
    }
  });
}

function buildQueryUrl(url, queryStrings) {
  //TODO: parse and transform query to tastypie filters
  var queryUrl = url + "?";
  //var queryUrl = url;
  //var queryStrings = parseQuery(query);
  queryStrings.map(function(qs){queryUrl += ("&" + qs);});

  //var queryUrl = url + "?order_by=modified_on"
  return queryUrl;
}

