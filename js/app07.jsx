var CaseverListItem = React.createClass({
  render: function() {
    return (
      <div className="caseverListItem">
        <input type="checkbox"/>
        <div className="status">{this.props.casever.status}</div> 
        <div className="name">{this.props.casever.name}</div>
      </div>
    )
  }
});

var CaseverList = React.createClass({
  render: function() {
    
    var casevers = this.props.casevers.map(function(casever){
      return (<CaseverListItem casever={casever}/>)
    }.bind(this))

    return (
      <div className="caseverList">
        {casevers}
      </div>
    )
  }
});

var SearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var query = this.refs.searchbox.getDOMNode().value;
    this.props.onSearch(query);
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" id="searchInput" ref="searchbox" />
        <button type="submit" id="searchSubmit">Search</button>
      </form>
    )
  }
});

/* 1. Extract the search part as reuseable mixin */
SearchableListMixin = {
  getInitialState: function() {
    return {casevers:[{stats: "", name: "Loading..."}]};
  },

  componentDidMount: function() {
    var onSuccess = function(data){
      this.setState({casevers: data})
    }
    /* 3. URL are extracted */
    fakeAJAX(this.baseURL, onSuccess, this)
  },

  handleSearch: function (query){
    this.setState({casevers:[{stats: "", name: "Loading..."}]});

    var onSuccess = function(data){
      this.setState({casevers: data})
    }
    fakeAJAX(this.baseURL + "/?search=" + query, onSuccess, this)
  },
}

var SearchableCaseverList = React.createClass({
  /* 2. Using Mixins */
  mixins: [SearchableListMixin],

  /* 4. Assign the URL used by the mixin */
  baseURL: "http://moztrap.fake.com",

  render: function() {
    return (
      <div>
        <SearchForm onSearch={this.handleSearch}/>
        <CaseverList casevers={this.state.casevers}/>
      </div>
    )
  }
})


React.render(<SearchableCaseverList/>, document.body);

/* Simulate a AJAX that will return after 2 sec*/
function fakeAJAX(url, successCallback, context){
  var fakeData = [
    {status: "active", name:"item 01"},
    {status: "active", name:"item 02"},
    {status: "active", name:"item 03"},
  ]
  if (url.indexOf("search")>=0) {
    fakeData = [
      {status: "active", name:"item 06"},
      {status: "active", name:"item 07"},
    ]
    
  }

  setTimeout(successCallback.bind(context, fakeData), 2000);
}

