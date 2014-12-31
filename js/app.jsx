var Router = window.ReactRouter;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function() {
    return (<RouteHandler {...this.props}/>)
  }
});

var SearchForm= React.createClass({
  handleSubmit: function(e) {
    console.log('search submitted ' + this.refs.searchbox.getDOMNode().value);
    e.preventDefault();
    console.log(this.props.onSubmit); this.props.onSubmit(this.refs.searchbox.getDOMNode().value);
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" id="searchInput" ref="searchbox" defaultValue={this.props.query} />
        <button type="submit" id="searchSubmit">Search</button>
      </form>
    )
  }
});

var CaseverListItem = React.createClass({
  render: function() {
    return (
      <div className="caseverListItem">
        <input type="checkbox"/>
        <div className="status">
          {this.props.casever.status}
        </div>
        <div className="name">
          {this.props.casever.name}
        </div>
        <div className="productversion">
          {this.props.casever.productversion}
        </div>
      </div>
    )
  }
});

var CaseverList = React.createClass({
  render: function() {
    //can use the casevers.meta
    var casevers = this.props.casevers.objects.map(function(casever){
      return (<CaseverListItem casever={casever} />)
    })

    return (
      <div className="caseverList">
        {casevers}
      </div>
    )
  }
});

var SearchableCaseverList = React.createClass({
  api_url: "https://moztrap.mozilla.org/api/v1/caseversion/",
  //TODO: migrate to api_url: "https://moztrap.mozilla.org/api/v1/caseversionsearch/",
  loading: {meta:{}, objects: [{status:"Loading..."}]},
  loadCasevers: function(query) {
    var limit = 20;
    var url = buildQueryUrl(this.api_url, query, caseversionCodegen) + "&limit=" + limit;
    if (typeof this.props.suiteId !== "undefined"){
      url += "&case__suites=" + this.props.suiteId;
    }
    $.ajax({
      url: url,
      dataType: 'jsonp',

      success: function(data) {
        this.setState({casevers: data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  getInitialState: function() {
    return {query: "product:\"Firefox OS\"", casevers: this.loading};
  },

  componentDidMount: function() {
    this.loadCasevers(this.state.query);
  }, handleSearch: function(query) { this.loadCasevers(query)
    this.setState({query: query, casevers: this.loading})
  },

  componentWillReceiveProps: function() {
    this.setState({casevers: this.loading})
    this.loadCasevers(this.state.query);
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch}/>
        <CaseverList casevers={this.state.casevers}/>
      </div>
    )
  }
})

var SuiteListItem = React.createClass({
  render: function() {
    return (
      <div className="suiteListItem">
        <input type="checkbox"/>
        <div className="status">
          {this.props.suite.status}
        </div>
        <div className="name">
          <a href={"./index.html#/suite/" + this.props.suite.id}> 
            {this.props.suite.name}
          </a>
        </div>
      </div>
    )
  }
});

var SuiteList = React.createClass({
  render: function() {

    var suites = this.props.suites.objects.map(function(suite){
      return (<SuiteListItem suite={suite} />)
    })

    return (
      <div className="suiteList">
        {suites}
      </div>
    )
  }
});

var SearchableSuiteList = React.createClass({
  api_url: "https://moztrap.mozilla.org/api/v1/suite/",
  loading: {meta:{}, objects: [{status:"Loading..."}]},
  loadSuites: function(query) {
    var limit=20
    console.log('ajaxing ' + this.state.query)
    $.ajax({
      url: buildQueryUrl(this.api_url, query, suiteCodegen) + "&limit=" + limit,
      dataType: 'jsonp',

      success: function(data) {
        this.setState({suites: data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  getInitialState: function() {
    return {query: "product:\"Firefox OS\"", suites: this.loading};
  },

  componentDidMount: function() {
    this.loadSuites(this.state.query);
  },


  handleSearch: function(query) {
    this.loadSuites(query);
    this.setState({query: query, suites: this.loading});
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch}/>
        <SuiteList suites={this.state.suites}/>
      </div>
    )
  }
})

var AddToSuite = React.createClass({
  //mixins: [Router.State],
  api_url: "https://moztrap.mozilla.org/api/v1/suite/",
  loadSuite: function(id) {
    $.ajax({
      url: this.api_url + id + "/",
      dataType: 'jsonp',

      success: function(data) {
        this.setState({suite: data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  
  getInitialState: function() {
    return {suite: {name: "Loading...", id: this.props.params.id}};
  },

  componentDidMount: function() {
    this.loadSuite(this.props.params.id);
  },

  componentWillReceiveProps: function() {
    //this.setState{suite: {name: "Loading...", id: this.props.params.id}}
    this.setState({suite: {id: this.props.params.id}});
    this.loadSuite(this.props.params.id);
  },

  render: function() {
    return (
      <div>
        <h1>Add to suite </h1>
        <h2>{this.state.suite.name}</h2>
        <SearchableCaseverList suiteId={this.state.suite.id}/>
      </div>
    )
  }
})

        //<SearchableCaseverList suiteId={this.state.suite.id}/>
//React.render(
//  <SearchableCaseverList url={apiUrl}/>,
//  document.getElementById("content")
//);

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={SearchableCaseverList}/>
    <Route name="caseversions" path="/caseversion" handler={SearchableCaseverList}/>
    <Route name="suites" path="/suite" handler={SearchableSuiteList}/>
    <Route name="suite" path="/suite/:id" handler={AddToSuite} />
  </Route>
);

Router.run(routes, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
})
