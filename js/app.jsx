var Router = window.ReactRouter;
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Badge = ReactBootstrap.Badge
var Button = ReactBootstrap.Button
var ButtonGroup = ReactBootstrap.ButtonGroup
var Row    = ReactBootstrap.Row
var Col    = ReactBootstrap.Col
var Grid   = ReactBootstrap.Grid
var Input  = ReactBootstrap.Input
var Label  = ReactBootstrap.Label
var Table  = ReactBootstrap.Table
var Navbar  = ReactBootstrap.Navbar
var CollapsableNav= ReactBootstrap.CollapsableNav
var Nav= ReactBootstrap.Nav
var NavItem= ReactBootstrap.NavItem
var Glyphicon= ReactBootstrap.Glyphicon

var caseverSetting = new Array();
caseverSetting.pagename = "caseversion";
caseverSetting.syntaxlink = "help/syntax_caseversion.html";
caseverSetting.header = [
{text: ""},
{text: "ID"},
{text: "name", sortable: true, filtername: "name"},
{text: "priority", sortable: true, filtername: "case__priority"},
{text: "product", sortable: true, filtername: "productversion"},
{text: "modified", sortable: true, filtername: "modified_on"},
{text: ""},
{text: ""},
];

var suiteSetting = new Array();
suiteSetting.pagename = "suite";
suiteSetting.syntaxlink = "help/syntax_suite.html";
suiteSetting.header = [
{text: ""},
{text: "ID"},
{text: "status"},
{text: "name", sortable: true, filtername: "name"},
{text: "modified", sortable: true, filtername: "modified_on"},
{text: ""},
{text: ""},
]


var Header = React.createClass({
  render: function() {
    return (
      <Navbar brand="MozTrap+" inverse toggleNavKey={0}>
        <Nav navbar>
          <NavItem eventKey={1} href="#">Case</NavItem>
          <NavItem eventKey={2} href="#/suite">Suite</NavItem>
        </Nav>
        <Nav navbar right>
          <NavItem eventKey={3} href="#/settings"><Glyphicon glyph="cog"/></NavItem>
        </Nav>
      </Navbar>
    )
  }
})

var Footer = React.createClass({
  render: function() {
    return (
      <Row>
        <hr/>
        <a href="https://github.com/shinglyu/moztrap-new-ui/issues">Report Issues</a> 
        <span> | </span>
        <a href="https://github.com/shinglyu/moztrap-new-ui/">Source Code</a>
        <span> | </span>
        <a href="mailto://slyu@mozilla.com"><Glyphicon glyph="envelope"/></a>
      </Row>
    )
  }
})



var App = React.createClass({
  render: function() {
    return (
      <div>
      <Header/>
      <Grid>
      <RouteHandler {...this.props}/>
      <Footer/>
      </Grid>
      </div>
    )
  }
});


var SearchableRemoteListMixin = {
  //need to implement `function buildURL(query) {...}`
  loading: {meta:{}, objects: [{name:"Loading..."}]},
  notFound: {data:{objects:[{name:"Can't find anything. Try loosen the search criteria."}]}},
  
  updateListUIState: function(data) {
    // 1. Hightlight the loaded page.
    $('li.pre-active').attr('class', 'active'); 

    // 2. Unchecked all boxes.
    $.each($('tr td input[type=checkbox]:checked'), function() {
      $(this).prop('checked', false);
    });

    // 3. Check boxes whose ID matches checkedIDs.
    var checkedIDs = this.state['checked'];
    $.each($('tr td input[type=checkbox]'), 
      function() { 
        for (i = 0; i < checkedIDs.length; i++) { 
          if ($(this).val() == checkedIDs[i])
            $(this).prop('checked', true);
        }
    });
  }, 

  loadOnePage: function(url, clickedPageNum) {
    clickedPageNum = typeof clickedPageNum !== 'undefined' ? clickedPageNum : 1;
    var selectedPageOffset = (clickedPageNum-1) * this.state.data.meta.limit;
    url = url.replace(/offset=[0-9]+/, "offset=" + selectedPageOffset);

    console.log("===> loadOnePage URL = ", url)

    $.ajax({
      url: url,
      timeout: 10000, // Force trigger the error callback

      success: function(data) {
        var availablePages = 0;
        if (data.meta.next != null && typeof data.meta.next != 'undefined') {
          availablePages = parseInt(data.meta.total_count / data.meta.limit)
          if (data.meta.total_count % data.meta.limit != 0)
            availablePages += 1;
        }
        this.setState({data: data, queriedPageCount: availablePages});
        
        this.updateListUIState(data);
      }.bind(this),

      error: function(xhr, status, err) {
        this.setState(this.notFound)
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    var defaultQuery = ""
    if (typeof this.props.params !== "undefined" && 
        typeof this.props.params.query !== "undefined") {
      defaultQuery = this.props.params.query;
    } else {
      defaultQuery = "product:\"" + config.defaultProduct + "\"";
    }
  
    return {query: defaultQuery, data: this.loading, checked: [], queriedPageCount: 0};
  },

  componentDidMount: function() {
    this.loadOnePage(this.buildURL(this.state.query));
  }, 
  
  handleSearch: function(query) { 
    this.loadOnePage(this.buildURL(query));
    this.setState({query: query, data: this.loading});
    //TODO: two way data binding?
    this.refs.searchform.forceUpdateInput(query);
    window.history.pushState({}, "MozTrap", document.URL.split("search/")[0] + "search/" + encodeURI(query));
  },

  handlePageLoading: function(page) {
    this.loadOnePage(config.baseUrl + this.state.data.meta.next, page);
  },

  handleAddFilter: function(additionalQuery, removeRegex){
    var newQuery = this.state.query.replace(removeRegex, "")
    console.log(newQuery)
    this.handleSearch(newQuery + additionalQuery);
  },

}

var CaseverToolbar = React.createClass({
  render: function() {
    console.log("render");
    var newButton = <div></div>;
    var diffButton = <div></div>;

    var diffURL = "";
    var diffDisabled = true;

    if (typeof this.props.checked !== "undefined"){
      diffURL = "diff.html?lhs=" + this.props.checked[0] + "&rhs=" + this.props.checked[1]
      if (this.props.checked.length == 2){
        var diffDisabled = false;
      }
    //create diff button
    }

    return (
      <Row>
        <Col md="12">
          <Button href='https://moztrap.mozilla.org/manage/case/add/' >+ New Case</Button>
          <Button bsStyle="success" target="blank_" href={diffURL} disabled={diffDisabled}>diff</Button>
        </Col>
      </Row>
    )
  }
})

var SuiteToolbar = React.createClass({
  render: function() {
    return (
      <Row>
        <Col md="12">
          <Button bsStyle="success" href='https://moztrap.mozilla.org/manage/suite/add/' >+ New Suite</Button>
        </Col>
      </Row>
    )
  }
})


var SearchableList = React.createClass({
  mixins: [SearchableRemoteListMixin],

  buildURL: function(query) {
      var api_url =  config.baseUrl + "/api/v1/" + this.props.setting.pagename;
      var codegen;
      var pagename = this.props.setting.pagename;
      if (pagename == "caseversion") {
        codegen = caseversionCodegen;
      } else if (pagename == "suite") {
        codegen = suiteCodegen;
      } else if (pagename == "caseselection") {
        codegen = caseSelectionCodegen;
      } else {
        codegen = null;
      }
      return (buildQueryUrl(api_url, query, codegen) +
              "&limit=" + config.defaultListLimit
             );
  },

  handleQueueUpdate: function(e) {
    var newState = {};
    if (e.target.checked){
      newState['checked'] = this.state['checked'].concat(e.target.value);
    }
    else {
      this.state['checked'].splice(this.state['checked'].indexOf(e.target.value), 1);
      newState['checked'] = this.state['checked'];
    }
    this.setState(newState);
    console.log("===> handleQueueUpdate: ", newState);
  },


  render: function() {
    return (
      <div>
        <this.props.toolbar setting={this.props.setting} checked={this.state.checked} />
        <SearchForm ref="searchform" query={this.state.query} onSubmit={this.handleSearch} setting={this.props.setting}/>
        <MTTable setting={this.props.setting} data={this.state.data} handleAddFilter={this.handleAddFilter} handleCheck={this.handleQueueUpdate}/>
        <PaginationContainer onPageSelected={this.handlePageLoading} totalPageCount={this.state.queriedPageCount} />
      </div>
    )
  }
})

// http://stackoverflow.com/questions/27864720/react-router-pass-props-to-handler-component
var CaseVerWrapper = React.createClass({
  render: function() {
    return (
      <SearchableList setting={caseverSetting} toolbar={CaseverToolbar}/>
    )
  }
})

var SuiteWrapper = React.createClass({
  render: function() {
    return (
      <SearchableList setting={suiteSetting} toolbar={SuiteToolbar}/>
    )
  }
})

var SearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.searchbox.getDOMNode().firstChild.value); //FIXME: firstChild is a hack!
  },
  forceUpdateInput: function(query){
    console.log(this.refs.searchbox.getDOMNode())
    this.refs.searchbox.getDOMNode().firstElementChild.value= query;
  },
  render: function() {
    if (typeof this.props.setting.syntaxlink !== "undefined") {
        var helplink = <small>(<a href={this.props.setting.syntaxlink} target="_blank">help</a>)</small>;
    }
    return (
      <Row>
      <form onSubmit={this.handleSubmit}>
        <Col xs={10} md={10}>
        <Input type="text" id="searchInput" ref="searchbox" defaultValue={this.props.query} />
        </Col>
        <Col xs={2} md={2}>
        <Button bsStyle="primary" type="submit" id="searchSubmit">Search</Button>
        {helplink}
        </Col>
      </form>
      </Row>
    )
  }
});

var PaginationContainer = React.createClass({
   getInitialState: function() {
     return {
       maxDisplayPages: 10,
       totalPageCount: 0
     };
   },
 
   render: function() {
   return  (
     <div id="react-paginator">
       <Pagination numPages={this.props.totalPageCount} maxDisplayPages={this.props.maxDisplayPages} onClick={this.props.onPageSelected} />
     </div>
     );
   }

});

//TODO: using client side sort for now, use this when two way data binding is OK
var SortableTh = React.createClass({
  handleSort: function(){
    //alert('sort by ' + this.props.name)
    var newOrder = null 
    if (this.state.order == ""){
        newOrder = "-"
    }
    else if (this.state.order == "-"){
        newOrder = ""
    }
    else {
        newOrder = ""
    }
    this.setState({"order": newOrder})
    this.props.handleAddFilter(' orderby:' + newOrder + this.props.filter, / orderby:[-\w]+/)
  },
  getInitialState: function(){
    return ({"order": null}) //+ and -
  },
  render: function(){
    var marker=""
    if (this.state.order == ""){
      marker = "▼";
    }
    else if (this.state.order == "-"){
      marker = "▲";
    }
    return(
      <th id={"orderby_"+ this.props.filter} onClick={this.handleSort}>{this.props.name}{marker}</th>
    )
  }
})

var CaseverListItem = React.createClass({
  handleTagClick: function(e){
    tagname = e.target.innerHTML;
    this.props.handleAddFilter(" tag:\"" + tagname + "\"");
  },
  render: function() {
    var detailUrl = config.baseUrl + "/manage/cases/_detail/" + this.props.casever.id;
    // Formatting tags
    // TODO: make each tag a div
    if (typeof this.props.casever.tags !== "undefined"){
      var tags = this.props.casever.tags.map(function(tag){
        return <Badge className="tag" onClick={this.handleTagClick}>{tag.name}</Badge>
      }, this)
    }
    if (typeof this.props.casever.case !== "undefined"){
      var caseId = this.props.casever.case.split('/')[4]
    }
    return (
      <tr className="caseverListItem">
        <td>
          <input type="checkbox" value={this.props.casever.id} onChange={this.props.onChange}/>
        </td>
        <td className="id">
          {this.props.casever.id}
        </td>
        <td className="status">
          {this.props.casever.status}
        </td>
        <td className="name">
          <a href={detailUrl} target="_blank">{this.props.casever.name}</a> <small>{tags}</small>
        </td>
        <td className="priority">
          {this.props.casever.priority}
        </td>
        <td className="productversion">
          {this.props.casever.productversion_name}
        </td>
        <td className="modified_on">
          {this.props.casever.modified_on}
        </td>
        <td className="edit">
          <a title="edit" href={config.baseUrl + "/manage/caseversion/" + this.props.casever.id}>
            <Glyphicon glyph="pencil"/>
          </a>
        </td>
        <td className="sharelink">
          <a title="share link" href={config.baseUrl + "/manage/cases/?filter-id=" + caseId}> 
            <Glyphicon glyph="share"/>
          </a>
        </td>
      </tr>
    )
  }
});


var MTTableHeadTh = React.createClass({
  handleSort: function(){
    var newOrder = "";
    if (this.state.order == "") {
      newOrder = "-";
    }
    this.setState({"order": newOrder})
    this.props.handleAddFilter(' orderby:' + newOrder + this.props.filter, / orderby:[-\w]+/)
  },
  getInitialState: function(){
    return ({"order": null}) //+ and -
  }, render: function(){
    var marker=""
    if (this.state.order == ""){
      marker = "▼";
    }
    else if (this.state.order == "-"){
      marker = "▲";
    }

    return(
      <th onClick={this.handleSort}>{this.props.text}{marker}</th>
    )
  }
})

var MTTableHead = React.createClass({
  render: function() {
    var obj = this.props.setting.header;
    var tableheader = obj.map(
      function(setting){
        if (setting["sortable"]) {
          return (
            <MTTableHeadTh text={setting["text"]} filter={setting["filtername"]}
            handleAddFilter={this.props.handleAddFilter} />
          )
        } else {
          return <th>{setting["text"]}</th>
        }
      }.bind(this))

    return (
      <tr>{tableheader}</tr>
    )
  }
})

var MTTable = React.createClass({
  render: function() {
    var content
    if (this.props.setting.pagename == "caseversion") {
      content = this.props.data.objects.map(
          function(casever) {
            return (<CaseverListItem
                casever={casever}
                onChange={this.props.handleCheck}
                handleAddFilter={this.props.handleAddFilter}/>)
          }.bind(this))
    } else if (this.props.setting.pagename == "suite") {
      content = this.props.data.objects.map(
          function(suite) {
            return (<SuiteListItem suite={suite} />)
          })
    }

    return (
      <Row>
      <Table striped condensed hover className={this.props.setting.pagename}>
        <tbody>
          <MTTableHead setting={this.props.setting}
            handleAddFilter={this.props.handleAddFilter}/>
          {content}
        </tbody>
      </Table>
      </Row>
    )
  }
});
//{casevers}

var SuiteListItem = React.createClass({
  render: function() {
    // TODO: handleQueueUpdate should also be called by SuiteListItem.
    return (
      <tr className="suiteListItem">
        <td>
          <input type="checkbox"/>
        </td>
        <td className="id">
          {this.props.suite.id}
        </td>
        <td className="status">
          {this.props.suite.status}
        </td>
        <td className="name">
          <a href={"./index.html#/caseversion/search/suite:\"" + this.props.suite.name + "\""}> 
            {this.props.suite.name}
          </a>
        </td>
        <td className="modified_on">
          {this.props.suite.modified_on}
        </td>
        <td className="edit">
          <a title="edit" href={"./index.html#/suite/" + this.props.suite.id}> 
            <Glyphicon glyph="pencil"/>
          </a>
        </td>
        <td className="sharelink">
          <a title="share link" href={config.baseUrl + "/manage/cases/?filter-suite=" + this.props.suite.id}> 
            <Glyphicon glyph="share"/>
          </a>
        </td>
      </tr>
    )
  }
});

var SearchableSuiteList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/suite/",
  buildURL: function(query) {
      return (buildQueryUrl(this.api_url, query, suiteCodegen) + 
                           "&limit=" + config.defaultListLimit
             );
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch} />
        <CaseverList casevers={this.state.data}/>
        <MoreLink onLoadMore={this.handleLoadMore} buttonDisabled={this.state.hasNoLinkToShow}/>
        <PaginationContainer onPageSelected={this.handlePageLoading} totalPageCount={this.state.queriedPageCount} />
      </div>
    )
  }
});

var CaseListItem = React.createClass({
  render: function() {
    var detailUrl = config.baseUrl + "/manage/cases/_detail/" + this.props.casever.id;
    // Formatting tags
    // TODO: make each tag a div
    if (typeof this.props.casever.tags !== "undefined"){
      var tags = this.props.casever.tags.map(function(tag){return <Badge>{tag.name}</Badge>})//.join(", ")
    }
    if (typeof this.props.casever.case !== "undefined"){
      var caseId = this.props.casever.case.split('/')[4]
    }
    return (
      <tr className="caseListItem">
        <td>
          <input type="checkbox" value={this.props.casever.case} onChange={this.props.onChange}/>
        </td>
        <td className="name">
          <a href={detailUrl} target="_blank">{this.props.casever.name}</a> <small>{tags}</small>
        </td>
        <td className="priority">
          {this.props.casever.priority}
        </td>
        <td className="modified_on">
          {this.props.casever.modified_on}
        </td>
      </tr>
    )
  }
});


var CaseList = React.createClass({
  render: function() {
    //can use the casevers.meta
    var casevers = this.props.casevers.objects.map(function(casever){
      return (<CaseListItem casever={casever} onChange={this.props.handleCheck}/>)
    }.bind(this))

    return (
      <Row>
      <Table striped condensed hover className="caseverList">
        <tbody>
          <tr>
            <th></th>
            <SortableTh name="name" filter="name" handleAddFilter={this.props.handleAddFilter}></SortableTh>
            <SortableTh name="priority" filter="case__priority" handleAddFilter={this.props.handleAddFilter}></SortableTh>
            <SortableTh name="modified" filter="modified_on" handleAddFilter={this.props.handleAddFilter}></SortableTh>
          </tr>
          {casevers}
        </tbody>
      </Table>
      </Row>
    )
  }
});

SearchableCaseSelectionList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseselection/",
  buildURL: function(query) {
      var url = buildQueryUrl(this.api_url, query, caseselectionCodegen);
      url += "&case__suites" + (this.props.isNotIn?"__ne":"") + "=" + this.props.suiteId;
      url += "&limit=" + config.defaultListLimit;
      return url
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.refresh){
      this.loadOnePage(this.buildURL(this.state.query)); //FIXME: this causes unwanted update when checked
    }
  },

  render: function() {
    return (
      <div id={this.props.id}>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch} syntaxlink={"help/syntax_caseselection.html"}/>
        <CaseList casevers={this.state.data} handleCheck={this.props.onCheck}/>
        <PaginationContainer onPageSelected={this.handlePageLoading} totalPageCount={this.state.queriedPageCount} />
      </div>
    )
  }
});

//FIXME: rename to something like SuiteManagement or similar
var AddToSuite = React.createClass({
  api_url: config.baseUrl + "/api/v1/suite/",
  loadSuite: function(id) {
    $.ajax({
      url: this.api_url + id + "/",

      success: function(data) {
        this.setState({suite: data}); 
        //FIXME: the sub lists will load itself in the first time, and will reload by this trigger, remove this by adding a refrsh flag in the state
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  
  getInitialState: function() {
    return ({suite: {name: "Loading...", id: this.props.params.id}, 
            addQueue:[], 
            removeQueue:[]
            })
  },

  componentDidMount: function() {
    this.loadSuite(this.props.params.id);
  },

  componentWillReceiveProps: function(nextProps) {
    //this.setState{suite: {name: "Loading...", id: this.props.params.id}}
    //this.setState({suite: {id: this.props.params.id}});
    //this.loadSuite(this.props.params.id);
  },

  handleModifySuite: function() {
    //console.log("For suite id: "+  this.state.suite.resource_uri)
    //console.log("You are about to add " + this.state.addQueue.join() + "; Remove " + this.state.removeQueue.join())
    /* Data format example:
      {
        case: "/api/v1/case/1/", //Can log in 
        suite: "/api/v1/suite/3/", //MozTrap bla bla
        order: 0,
      }
    */
    //FIXME: unnessary GET when add or removing cases

    /* Helper functions */
    function postSuiteCase(that) {
      //console.log(addDatum)
      if (addDatum.length == 0) { //update state to trigger refresh
        that.setState({addQueue:[]}); //Cleanup the add queue
        return;
      }
      var data = addDatum.pop()
      $.ajax({
        type: "POST",
        //TODO: ask user for username and apikey
        url: config.baseUrl + "/api/v1/suitecase/?username=" + config.username + "&api_key=" + config.api_key,
        contentType:"application/json",
        data: JSON.stringify(data),
        success: function(data) {
          //console.log("succeeded")
          postSuiteCase(that)
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    }

    function removeSuiteCase(removeDatum, that) {
      if (removeDatum.length == 0) { //update state to trigger refresh
        that.setState({removeQueue:[]}); //Cleanup the add queue
        return;
      }
      var data = removeDatum.pop()
      //Need to remove mtapi.py:198 to make this DELETE work
      $.ajax({
        type: "DELETE",
        //TODO: ask user for username and apikey
        url: config.baseUrl + "/api/v1/suitecase/" + data + "/?permanent=True&username=" + config.username + "&api_key=" + config.api_key,

        success: function(data) {
          removeSuiteCase(removeDatum, that)
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    }

    /* Add */
    var addDatum = this.state.addQueue.map(function(caseuri){
      return ({
        case: caseuri,
        suite: this.state.suite.resource_uri,
      });
    }, this)

    postSuiteCase(this)

    /* Remove; TODO: make add and remove more simialr*/
    var allSuitecases = undefined;
    var removeSuitecases = undefined;
    var removeDatum = undefined;
    $.ajax({
      type: "GET",
      url: config.baseUrl + "/api/v1/suitecase/?suite=" + this.state.suite.id,

      success: function(data) {
        allSuitecases = data.objects;
        removeSuitecases = allSuitecases.filter(function(sc){ return (this.state.removeQueue.indexOf(sc.case) >= 0);}.bind(this));
        removeDatum = removeSuitecases.map(function(sc) {return sc.id;})
        removeSuiteCase(removeDatum, this)
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.toString());
      }.bind(this)
    });

    /* Cleanup */

    [].forEach.call(document.querySelectorAll('input[type=checkbox]'), function(checkbox){
      checkbox.checked = false;
    });
  },

  handleQueueUpdate: function(e, queueName) {
alert("dddd");
    if (e.target.checked){
      var newState = {};
      newState[queueName] = this.state[queueName].concat(e.target.value);
      console.log('will set state')
      this.setState(newState);
    }
    else {
      this.state[queueName].splice(this.state[queueName].indexOf(e.target.value), 1);
      var newState = {};
      newState[queueName] = this.state[queueName];
      console.log('will set state')
      this.setState(newState);
    }
  },

  handleAdd: function(e) {
    console.log('handladd')
    this.handleQueueUpdate(e, "addQueue")
  },

  handleRemove: function(e) {
    this.handleQueueUpdate(e, "removeQueue")
  },

  render: function() {
    if (config.username == null || config.username == ""){ //FIXME: maybe set username default as null?
      var credental_not_set_msg = <a href="#/settings">Click to set your username and api key before use</a>
      var credental_not_set = true
    }
    
    return (
      <Grid>
        <Row>
          <h1>{this.state.suite.name}</h1>
        </Row>
        <Row>
          <Col mdOffset={8}>
            {credental_not_set_msg}
            <Button bsStyle="success" block disabled={credental_not_set} id="modifySuiteTop" onClick={this.handleModifySuite}>Submit</Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <h2>Add to suite </h2>
            <SearchableCaseSelectionList isNotIn={true} 
                                         suiteId={this.state.suite.id}
                                         onCheck={this.handleAdd}
                                         refresh={this.state.addQueue.length == 0 && 
                                                  this.state.removeQueue.length == 0}
                                         id="ni_list"
                                                  
            />
          </Col>
          <Col xs={12} md={6}>
          <h2>Remove from suite </h2>
          <SearchableCaseSelectionList isNotIn={false} 
                                       suiteId={this.props.params.id}
                                       onCheck={this.handleRemove}
                                       refresh={this.state.addQueue.length == 0 && this.state.removeQueue.length == 0}
                                       id="in_list"
          />
          </Col>
        </Row>
        
        <Row>
          <Col mdOffset={8}>
            {credental_not_set_msg}
            <Button bsStyle="success" block disabled={credental_not_set} id="modifySuite" onClick={this.handleModifySuite}>Submit</Button>
          </Col>
        </Row>
      </Grid>
    )
  }
})

var Settings = React.createClass({
  getInitialState: function() {
    localforage.getItem('username').then(function(val){
      this.setState({'username':val})
    }.bind(this))
    localforage.getItem('api_key').then(function(val){
      this.setState({'api_key':val})
    }.bind(this))
    return ({'username': "Loading...", 'api_key':"Loading...",
            });

  },
  handleUpdate: function() {
    if (this.refs.username.getValue() !== ''){
      localforage.setItem('username', this.refs.username.getValue()).then(refreshConfig)//TODO:trim?
    }
    if (this.refs.api_key.getValue() !== ''){
      localforage.setItem('api_key', this.refs.api_key.getValue()).then(refreshConfig)
    }
    //TODO: change button color when all saved
    //this.setState({'buttonStyle': "success"})

  },
  render: function() {
    return (
      <Row>
      <Col md={12}>
        <Input type="text" label="MozTrap Username" id="usernameInput" ref='username' placeholder={this.state.username} />
        <Input type="text" label="API Key" id="apikeyInput" ref='api_key' placeholder={this.state.api_key}/>
        <Button type="submit" id="saveBtn" bsStyle="primary" onClick={this.handleUpdate}>Save</Button>
      </Col>
      </Row>
    )
  }
})

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={CaseVerWrapper}/>
    <Route name="caseversion" path="/caseversion" handler={CaseVerWrapper}/>
    <Route name="suite" path="/suite" handler={SuiteWrapper}/>
    <NotFoundRoute handler={CaseVerWrapper}/>
  </Route>
);

Router.run(routes, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
})
