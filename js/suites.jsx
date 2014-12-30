var SuiteListItem = React.createClass({
  render: function() {
    return (
      <div className="suiteListItem">
        <input type="checkbox"/>
        <div className="status">
          {this.props.suite.status}
        </div>
        <div className="name">
          {this.props.suite.name}
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
  loading: {meta:{}, objects: [{status:"Loading..."}]},
  loadSuites: function(query) {
    var limit=20
    console.log('ajaxing ' + this.state.query)
    $.ajax({
      url: buildQueryUrl(this.props.url, query, suiteCodegen) + "&limit=" + limit,
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
    this.loadSuites(query)
    this.setState({query: query, suites: this.loading})
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


var apiUrl="https://moztrap.mozilla.org/api/v1/suite/";



React.render(
  <SearchableSuiteList url={apiUrl}/>,
  document.getElementById("content")
);
