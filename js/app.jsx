var SearchForm= React.createClass({
  render: function() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <input type="text" id="searchInput" defaultValue={this.props.query} />
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
  loadCasevers: function() {
    $.ajax({
      url: buildQueryUrl(this.props.url, this.state.query),
      dataType: 'jsonp',

      success: function(data) {
        this.setState({query: this.state.query, casevers: data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  getInitialState: function() {
    return {query: "product:\"Firefox OS\"", casevers: {meta:{}, objects: [{status:"Loading..."}]}};
  },

  componentDidMount: function() {
    this.loadCasevers();
  },

  handleSearch: function() {
    this.loadCasevers()
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


var mockCasevers = [
  {"status": "active", "name": "Foobar!", "productversion": "Firefox OS 2.2"},
  {"status": "draft", "name": "Foobarbar!", "productversion": "Firefox OS 2.1"}
];

var apiUrl="https://moztrap.mozilla.org/api/v1/caseversion/";
//use jsonp to overcome CORS
//var jsonpApiUrl = "http://jsonp.nodejitsu.com/?callback=&url=" + apiUrl 

React.render(
  <SearchableCaseverList casevers={mockCasevers} url={apiUrl+ "?limit=20"}/>,
  document.getElementById("content")
);
