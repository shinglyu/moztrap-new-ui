function tokenize(query) {
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

function caseversionCodegen(tokens) {
  var toRESTQuery = {
    '':     'name__icontains=',
    'name': 'name__icontains=',
    'tag': 'tags__name__icontains=',
    'suite': 'case__suites__name__icontains=',
    'product': 'productversion__product__name__icontains=',
    'ver': 'productversion__version__icontains=',
    'status': 'status=',
  };
  //TODO:exact match?
  return tokens.map(function(token){
    token.value = token.value.replace(/"/g, '', 'g'); //tirm the \"
    if (typeof toRESTQuery[token.key] === "undefined") {
      return '';
    } else {
      return toRESTQuery[token.key] + encodeURI(token.value);
    }
  });
}

function caseselectionCodegen(tokens) {
  var toRESTQuery = {
    '':     'name__icontains=',
    'name': 'name__icontains=',
    'tag': 'tags__name__icontains=',
    'product': 'productversion__product__name__icontains=',
    'status': 'status=',
  };
  //TODO:exact match?
  return tokens.map(function(token){
    token.value = token.value.replace(/"/g, '', 'g'); //tirm the \"
    if (typeof toRESTQuery[token.key] === "undefined") {
      return '';
    } else {
      return toRESTQuery[token.key] + encodeURI(token.value);
    }
  });
  
}

function suiteCodegen(tokens) {
  var toRESTQuery = {
    '':     'name__icontains=',
    'name': 'name__icontains=',
    'product': 'product__name__icontains=',
    'status': 'status=',
  };
  //TODO:exact match?
  return tokens.map(function(token){
    token.value = token.value.replace(/"/g, '', 'g'); //tirm the \"
    if (typeof toRESTQuery[token.key] === "undefined") {
      return '';
    } else {
      return toRESTQuery[token.key] + encodeURI(token.value);
    }
  });
}

function buildQueryUrl(url, query, codegen) {
  //TODO: parse and transform query to tastypie filters
  var queryUrl = url + "?";
  //var queryUrl = url;
  var queryStrings = codegen(tokenize(query));
  queryStrings.map(function(qs){queryUrl += ("&" + qs);});

  //var queryUrl = url + "?order_by=modified_on"
  console.log(queryUrl);
  return queryUrl;
}

