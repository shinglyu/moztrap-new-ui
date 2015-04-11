//TODO: replace this with jison generated parser
function tokenize(query) {
  // separate qeury with space
  var re_tokenize = /([^\s"']+"([^"]*)"|[^\s]+)/g;
  var results = query.match(re_tokenize);

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
    'tag': 'tags__name__in=',
    'suite': 'case__suites__name__icontains=',
    'product': 'productversion__product__name__icontains=',
    'ver': 'productversion__version__icontains=',
    'status': 'status=',
    'orderby': 'order_by=',
  };
  var re_replace = /["']/g;

  return tokens.map(function(token){
    token.value = token.value.replace(re_replace, ""); //tirm the \"
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
    'tag': 'tags__name__in=',
    'suite': 'case__suites__name__icontains=',
    'product': 'productversion__product__name__icontains=',
    'status': 'status=',
    'orderby': 'order_by=',
  };
  var re_replace = /["']/g;

  //TODO:exact match?
  return tokens.map(function(token){
    token.value = token.value.replace(re_replace, ""); //tirm the \"
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
    'orderby': 'order_by=',
  };

  var re_replace = /["']/g;

  //TODO:exact match?
  return tokens.map(function(token){
    token.value = token.value.replace(re_replace, ""); //tirm the \"
    if (typeof toRESTQuery[token.key] === "undefined") {
      return '';
    } else {
      return toRESTQuery[token.key] + encodeURI(token.value);
    }
  });
}

/*
function urlCodegen(tokens) {
  return tokens.map(function(token){
    token.value = token.value.replace('"', '', 'g'); //tirm the \"
    return token.key + "=" + encodeURI(token.value);
  });
}
*/

function buildQueryUrl(url, query, codegen) {
  //TODO: parse and transform query to tastypie filters
  var queryUrl = url + "?";
  //var queryUrl = url;
  //console.log(query)
  var tokens = tokenize(query);
  //console.log(tokens)
  if (!tokens.map(function(tok){return tok['key']})
       .some(function(key){return key == 'orderby'})){
    tokens.push({'key':'orderby', 'value':'-modified_on'}); //FIXME: use default search term instead?
  }
  //console.log(tokens)
  var queryStrings = codegen(tokens);
  queryStrings.map(function(qs){queryUrl += ("&" + qs);});

  //var queryUrl = url + "?order_by=modified_on"
  //console.log(queryUrl);
  return queryUrl;
}

