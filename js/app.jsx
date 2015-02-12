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

var config = {
  baseUrl: "https://moztrap.mozilla.org",
  //baseUrl: "http://localhost:8000",
  //baseUrl: "https://moztrap.allizom.org",
  defaultProduct: "Firefox OS",
  //defaultProduct: "MozTrap",
  defaultListLimit: 20,
}

var SearchableRemoteListMixin = {
  //need to implement `function buildURL(query) {...}`
  loading: {meta:{}, objects: [{name:"Loading..."}]},
  notFound: {data:{objects:[{name:"Can't find anything. Try loosen the search criteria."}]}},
  loadRemoteData: function(url) {
    $.ajax({
      url: url,
      dataType: 'jsonp',
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
    //FIXME: dont' hardcode this url
    var url = config.baseUrl + this.state.data.meta.next;
    $.ajax({
      url: url,
      dataType: 'jsonp',

      success: function(data) {
        data.objects = this.state.data.objects.concat(data.objects)
        this.setState({data: data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {query: "product:\"" + config.defaultProduct + "\"", data: this.loading};
  },

  componentDidMount: function() {
    this.loadRemoteData(this.buildURL(this.state.query));
  }, 
  
  handleSearch: function(query) { 
    this.loadRemoteData(this.buildURL(query));
    this.setState({query: query, data: this.loading});
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
    this.props.onSubmit(this.refs.searchbox.getDOMNode().value);
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

var MoreLink = React.createClass({
  render: function() {
    return (
      <a className="morelink" href="javascript:void(0);" onClick={this.props.onLoadMore}>more</a>
    );
  }
});

var CaseverListItem = React.createClass({
  render: function() {
    return (
      <div className="caseverListItem">
        <input type="checkbox" value={this.props.casever.case} onChange={this.props.onChange}/>
        <div className="status">
          {this.props.casever.status}
        </div>
        <div className="name">
          {this.props.casever.name}
        </div>
      </div>
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
      <div className="caseverList">
        {casevers}
      </div>
    )
  }
});

var SearchableCaseverList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseversion/",
  //TODO: migrate to api_url: "https://moztrap.mozilla.org/api/v1/caseversionsearch/",
  buildURL: function(query) {
      return buildQueryUrl(this.api_url, query, caseversionCodegen) + "&limit=" + config.defaultListLimit;
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch}/>
        <CaseverList casevers={this.state.data}/>
        <MoreLink onLoadMore={this.handleLoadMore}/>
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
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/suite/",
  buildURL: function(query) {
      return buildQueryUrl(this.api_url, query, suiteCodegen) + "&limit=" + config.defaultListLimit;
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch}/>
        <SuiteList suites={this.state.data}/>
        <MoreLink onLoadMore={this.handleLoadMore}/>
      </div>
    )
  }
});

SearchableCaseverSelectionList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseversionselection/",
  //api_url: config.baseUrl + "/api/v1/caseselection/",
  //api_url: config.baseUrl + "/api/speedy/caseselection/",
  buildURL: function(query) {
      var url = buildQueryUrl(this.api_url, query, caseversionCodegen);
      url += "&case__suites" + (this.props.isNotIn?"__ne":"") + "=" + this.props.suiteId;
      url += "&limit=" + config.defaultListLimit;
      return url
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch}/>
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
      return url
  },

  render: function() {
    return (
      <div>
        <SearchForm query={this.state.query} onSubmit={this.handleSearch}/>
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
    return ({suite: {name: "Loading...", id: this.props.params.id}, 
            addQueue:[], 
            removeQueue:[]}
           )
  },

  componentDidMount: function() {
    this.loadSuite(this.props.params.id);
  },

  componentWillReceiveProps: function() {
    //this.setState{suite: {name: "Loading...", id: this.props.params.id}}
    this.setState({suite: {id: this.props.params.id}});
    this.loadSuite(this.props.params.id);
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
    var addDatum = this.state.addQueue.map(function(caseuri){
      return ({
        case: caseuri,
        suite: this.state.suite.resource_uri,
        //order: 0,
      });
    }, this)

    function postSuiteCase() {
      console.log(addDatum)
      if (addDatum.length == 0) {
        return;
      }
      var data = addDatum.pop()
      $.ajax({
        type: "POST",
        //TODO: ask user for username and apikey
        url: config.baseUrl + "/api/v1/suitecase/?username=admin-django&api_key=c67c9af7-7e07-4820-b686-5f92ae94f6c9",
        contentType:"application/json",
        data: JSON.stringify(data),
        success: function(data) {
          console.log("succeeded")
          postSuiteCase()
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    }
    postSuiteCase()

    var allSuitecases = undefined;
    var removeSuitecases = undefined;
    var removeDatum = undefined;
    $.ajax({
      type: "GET",
      //TODO: ask user for username and apikey
      url: config.baseUrl + "/api/v1/suitecase/?suite=" + this.state.suite.id,

      success: function(data) {
        allSuitecases = data.objects;
        removeSuitecases = allSuitecases.filter(sc => (this.state.removeQueue.indexOf(sc.case) >= 0));
        removeDatum = removeSuitecases.map(sc => sc.id)
        removeSuiteCase(removeDatum)
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.toString());
      }.bind(this)
    });

    function removeSuiteCase(removeDatum) {
      if (removeDatum.length == 0) {
        return;
      }
      var data = removeDatum.pop()
      //Need to remove mtapi.py:198 to make this DELETE work
      $.ajax({
        type: "DELETE",
        //TODO: ask user for username and apikey
        url: config.baseUrl + "/api/v1/suitecase/" + data + "/?permanent=True&username=admin-django&api_key=c67c9af7-7e07-4820-b686-5f92ae94f6c9",

        success: function(data) {
          if (removeDatum.length == 0){return;}
          removeSuiteCase(removeDatum)
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    }
  },

  handleQueueUpdate: function(e, queueName) {
    if (e.target.checked){
      var newState = {};
      newState[queueName] = this.state[queueName].concat(e.target.value);
      this.setState(newState);
    }
    else {
      this.state[queueName].splice(this.state[queueName].indexOf(e.target.value), 1);
      var newState = {};
      newState[queueName] = this.state[queueName];
      this.setState(newState);
    }
  },
  handleAdd: function(e) {
    this.handleQueueUpdate(e, "addQueue")
  },

  handleRemove: function(e) {
    this.handleQueueUpdate(e, "removeQueue")
  },

  render: function() {
    return (
      <div>
        <h2>{this.state.suite.name}</h2>
        <h1>Add to suite </h1>
        <SearchableCaseSelectionList isNotIn={true} 
                                     suiteId={this.state.suite.id}
                                     onCheck={this.handleAdd}
        />
        <h1>Remove from suite </h1>
        <SearchableCaseSelectionList isNotIn={false} 
                                     suiteId={this.state.suite.id}
                                     onCheck={this.handleRemove}
        />
        <button id="modifySuite" onClick={this.handleModifySuite}>Submit</button>
      </div>
    )
  }
})

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={SearchableCaseverList}/>
    <Route name="caseversions" path="/caseversion" handler={SearchableCaseverList}/>
    <Route name="suites" path="/suite" handler={SearchableSuiteList}/>
    <Route name="suites_noid" path="/suite/" handler={SearchableSuiteList}/>
    <Route name="suite" path="/suite/:id" handler={AddToSuite} />
  </Route>
);

Router.run(routes, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
})
