var Router = window.ReactRouter;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var Button = ReactBootstrap.Button
var Row    = ReactBootstrap.Row
var Col    = ReactBootstrap.Col
var Grid   = ReactBootstrap.Grid
var Input  = ReactBootstrap.Input
var Table  = ReactBootstrap.Table
var Navbar  = ReactBootstrap.Navbar
var CollapsableNav= ReactBootstrap.CollapsableNav
var Nav= ReactBootstrap.Nav
var NavItem= ReactBootstrap.NavItem
var Glyphicon= ReactBootstrap.Glyphicon


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
  loadRemoteData: function(url) {
    $.ajax({
      url: url,
      timeout: 10000, // Force trigger the error callback

      success: function(data) {
        this.setState({data: data});
      }.bind(this),

      /*
      FIXME: this doesn't seem to work under jsonp proxy
      statusCode: {
        400: function() {
          alert.log('bad request');
        },
      },
      */
      error: function(xhr, status, err) {
        this.setState(this.notFound)
        console.error(xhr, status, err.toString());
      }.bind(this)
    });
  },
  //FIXME: Change this to pagination
  loadMore: function() {
    var url = config.baseUrl + this.state.data.meta.next;
    //console.log(this.state.data.meta)
    //console.log(url)
    $.ajax({
      url: url,

      success: function(data) {
        data.objects = this.state.data.objects.concat(data.objects)
        //console.log("LOADED!")
        this.setState({data: data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    if (typeof this.props.params.query !== "undefined"){
      return {query: this.props.params.query, data: this.loading};

    }
    else {
      //return {}
      return {query: "product:\"" + config.defaultProduct + "\"", data: this.loading};
    }
  },

  componentDidMount: function() {
    this.loadRemoteData(this.buildURL(this.state.query));
  }, 
  
  handleSearch: function(query) { 
    this.loadRemoteData(this.buildURL(query));
    this.setState({query: query, data: this.loading});
    window.history.pushState({}, "MozTrap", document.URL.split("caseversion/search/")[0] + "caseversion/search/" + encodeURI(query));
  },

  handleLoadMore: function() {
    this.loadMore();
  },

  /*
  componentWillReceiveProps: function() {
    this.setState({data: this.loading})
    this.loadRemoteData(this.buildURL(this.state.query));
  },
  */

}

var SearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.searchbox.getDOMNode().firstChild.value); //FIXME: firstChild is a hack!
  },
  render: function() {
    if (typeof this.props.syntaxlink !== "undefined") {
        var helplink = <small>(<a href={this.props.syntaxlink} target="_blank">help</a>)</small>;
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

var MoreLink = React.createClass({
  render: function() {
    return (
      <Button block onClick={this.props.onLoadMore}>
        load more
      </Button>
    );
  }
});

var CaseverListItem = React.createClass({
  render: function() {
    var detailUrl = config.baseUrl + "/manage/cases/_detail/" + this.props.casever.id;
    //console.log(this.props.casever.tags)
    // Formatting tags
    // TODO: make each tag a div
    if (typeof this.props.casever.tags !== "undefined"){
      var tags = this.props.casever.tags.map(function(tag){return "(" + tag.name + ")"}).join(", ")
    }
    if (typeof this.props.casever.case !== "undefined"){
      var caseId = this.props.casever.case.split('/')[4]
    }
    return (
      <tr className="caseverListItem">
        <td>
          <input type="checkbox" value={this.props.casever.case} onChange={this.props.onChange}/>
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

var CaseverList = React.createClass({
  render: function() {
    //can use the casevers.meta
    var casevers = this.props.casevers.objects.map(function(casever){
      return (<CaseverListItem casever={casever} onChange={this.props.onCheck}/>)
    }.bind(this))

    return (
      <Row>
      <Table striped condensed hover className="caseverList">
        <tbody>
        {casevers}
        </tbody>
      </Table>
      </Row>
    )
  }
});

var SearchableCaseverList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseversion/",
  //TODO: migrate to api_url: "https://moztrap.mozilla.org/api/v1/caseversionsearch/",
  buildURL: function(query) {
      return (buildQueryUrl(this.api_url, query, caseversionCodegen) + 
              "&limit=" + config.defaultListLimit
              //"&order_by=" + "-modified_on"
             );
  },

  render: function() {
    //update
    return (
      <Grid>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch} syntaxlink={"help/syntax_caseversion.html"}/>
        <CaseverList casevers={this.state.data}/>
        <MoreLink onLoadMore={this.handleLoadMore}/>
      </Grid>
    )
  }
})

var SuiteListItem = React.createClass({
  render: function() {
    return (
      <tr className="suiteListItem">
        <td>
          <input type="checkbox"/>
        </td>
        <td className="status">
          {this.props.suite.status}
        </td>
        <td className="name">
          <a href={"./index.html#/suite/" + this.props.suite.id}> 
            {this.props.suite.name}
          </a>
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

var SuiteList = React.createClass({
  render: function() {

    var suites = this.props.suites.objects.map(function(suite){
      return (<SuiteListItem suite={suite} />)
    })

    return (
      <Table striped condensed hover className="suiteList">
        <tbody>
          {suites}
        </tbody>
      </Table>
    )
  }
});

var SearchableSuiteList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/suite/",
  buildURL: function(query) {
      return (buildQueryUrl(this.api_url, query, suiteCodegen) + 
                           "&limit=" + config.defaultListLimit
                           //"&order_by=" + "-modified_on"
             );
  },

  render: function() {
    return (
      <Grid>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch} syntaxlink={"help/syntax_suite.html"}/>
        <SuiteList suites={this.state.data}/>
        <MoreLink onLoadMore={this.handleLoadMore}/>
      </Grid>
    )
  }
});

//TODO: can we remove this?
SearchableCaseverSelectionList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseversionselection/",
  //api_url: config.baseUrl + "/api/v1/caseselection/",
  //api_url: config.baseUrl + "/api/speedy/caseselection/",
  buildURL: function(query) {
      var url = buildQueryUrl(this.api_url, query, caseversionCodegen);
      url += "&case__suites" + (this.props.isNotIn?"__ne":"") + "=" + this.props.suiteId;
      url += "&limit=" + config.defaultListLimit;
      //url += "&order_by=" + "-modified_on";
      return url
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch} />
        <CaseverList casevers={this.state.data}/>
        <MoreLink onLoadMore={this.handleLoadMore}/>
      </div>
    )
  }
});

SearchableCaseSelectionList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseselection/",
  //api_url: config.baseUrl + "/api/speedy/caseselection/",
  buildURL: function(query) {
      var url = buildQueryUrl(this.api_url, query, caseselectionCodegen);
      url += "&case__suites" + (this.props.isNotIn?"__ne":"") + "=" + this.props.suiteId;
      url += "&limit=" + config.defaultListLimit;
      //url += "&order_by=" + "-modified_on";
      return url
  },

  componentWillReceiveProps: function(nextProps) {
    //load remote suite case list
    if (nextProps.refresh){
      this.loadRemoteData(this.buildURL(this.state.query)); //FIXME: this causes unwanted update when checked
    }
  },

  render: function() {
    return (
      <div id={this.props.id}>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch} syntaxlink={"help/syntax_caseselection.html"}/>
        <CaseverList casevers={this.state.data} onCheck={this.props.onCheck}/>
        <MoreLink onLoadMore={this.handleLoadMore}/>
      </div>
    )
  }
});

//FIXME: rename to something like SuiteManagement or similar
var AddToSuite = React.createClass({
  //mixins: [Router.State],
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
          //if (removeDatum.length == 0){return;}
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
        //order: 0,
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

    //this.loadSuite(this.props.params.id) //
    //this.setState({ addQueue:[], removeQueue:[] });

  },

  handleQueueUpdate: function(e, queueName) {
    if (e.target.checked){
      var newState = {};
      newState[queueName] = this.state[queueName].concat(e.target.value);
      //console.log('will set state')
      this.setState(newState);
    }
    else {
      this.state[queueName].splice(this.state[queueName].indexOf(e.target.value), 1);
      var newState = {};
      newState[queueName] = this.state[queueName];
      //console.log('will set state')
      this.setState(newState);
    }
  },
  handleAdd: function(e) {
    //console.log('handladd')
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
             //'buttonStyle': "primary"
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
    <DefaultRoute handler={SearchableCaseverList}/>
    <Route name="caseversions" path="/caseversion" handler={SearchableCaseverList}/>
    <Route name="caseversion_search" path="/caseversion/search/:query" handler={SearchableCaseverList}/>
    <Route name="suites" path="/suite" handler={SearchableSuiteList}/>
    <Route name="suites_noid" path="/suite/" handler={SearchableSuiteList}/>
    <Route name="suite" path="/suite/:id" handler={AddToSuite} />
    <Route name="settings" path="/settings" handler={Settings} />
  </Route>
);

Router.run(routes, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
})
