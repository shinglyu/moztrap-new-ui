var SearchForm= React.createClass({displayName: "SearchForm",
  handleSubmit: function(e) {
    console.log('search submitted ' + this.refs.searchbox.getDOMNode().value);
    e.preventDefault();
    console.log(this.props.onSubmit);
    this.props.onSubmit(this.refs.searchbox.getDOMNode().value);
  },
  render: function() {
    return (
      React.createElement("form", {onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", id: "searchInput", ref: "searchbox", defaultValue: this.props.query}), 
        React.createElement("button", {type: "submit", id: "searchSubmit"}, "Search")
      )
    )
  }
});

var CaseverListItem = React.createClass({displayName: "CaseverListItem",
  render: function() {
    return (
      React.createElement("div", {className: "caseverListItem"}, 
        React.createElement("input", {type: "checkbox"}), 
        React.createElement("div", {className: "status"}, 
          this.props.casever.status
        ), 
        React.createElement("div", {className: "name"}, 
          this.props.casever.name
        ), 
        React.createElement("div", {className: "productversion"}, 
          this.props.casever.productversion
        )
      )
    )
  }
});

var CaseverList = React.createClass({displayName: "CaseverList",
  render: function() {
    //can use the casevers.meta
    var casevers = this.props.casevers.objects.map(function(casever){
      return (React.createElement(CaseverListItem, {casever: casever}))
    })

    return (
      React.createElement("div", {className: "caseverList"}, 
        casevers
      )
    )
  }
});

var SearchableCaseverList = React.createClass({displayName: "SearchableCaseverList",
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
      React.createElement("div", null, 
        React.createElement(SearchForm, {query: this.state.query, onSubmit: this.handleSearch}), 
        React.createElement(CaseverList, {casevers: this.state.casevers})
      )
    )
  }
})


var apiUrl="https://moztrap.mozilla.org/api/v1/caseversion/";
//use jsonp to overcome CORS
//var jsonpApiUrl = "http://jsonp.nodejitsu.com/?callback=&url=" + apiUrl 

React.render(
  React.createElement(SearchableCaseverList, {url: apiUrl}),
  document.getElementById("content")
);
