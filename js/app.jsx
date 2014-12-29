var SearchForm= React.createClass({
  handleSubmit: function(e) {
    console.log('search submitted ' + this.refs.searchbox.getDOMNode().value);
    e.preventDefault();
    console.log(this.props.onSubmit);
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
  loading: {meta:{}, objects: [{status:"Loading..."}]},
  loadCasevers: function(query) {
    var limit=20
    console.log('ajaxing ' + this.state.query)
    $.ajax({
      url: buildQueryUrl(this.props.url, query) + "&limit=" + limit,
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
  },

  handleSearch: function(query) {
    this.loadCasevers(query)
    this.setState({query: query, casevers: this.loading})
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


var apiUrl="https://moztrap.mozilla.org/api/v1/caseversion/";
//use jsonp to overcome CORS
//var jsonpApiUrl = "http://jsonp.nodejitsu.com/?callback=&url=" + apiUrl 

React.render(
  <SearchableCaseverList url={apiUrl}/>,
  document.getElementById("content")
);
