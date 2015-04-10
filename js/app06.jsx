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
    /* 1. Call the parent's search handler */
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

var SearchableCaseverList = React.createClass({
  getInitialState: function() {
    return {casevers:[{stats: "", name: "Loading..."}]};
  },

  componentDidMount: function() {
    var onSuccess = function(data){
      this.setState({casevers: data})
    }
    fakeAJAX("http://moztrap.fake.com", onSuccess, this)
  },

  /* 2. Perform a AJAX search and update the state */
  handleSearch: function (query){
    this.setState({casevers:[{stats: "", name: "Loading..."}]});

    var onSuccess = function(data){
      this.setState({casevers: data})
    }
    fakeAJAX("http://moztrap.fake.com/?search=" + query, onSuccess, this)
  },

  render: function() {
    return (
      <div>
        {/* Pass down the function here vvvvvvv*/}
        <SearchForm onSearch={this.handleSearch}/>
        <CaseverList casevers={this.state.casevers}/>
      </div>
    )
  }
})

/* 
 + SearchableCaseverList <= owns the state, pass a update state function to its children
 ├- SearchForm <= need to update SeachableCaseverList's state, need to use the function given by SearchableCaseverList
 └+ CaseverList
  ├- CaseverListItem
  ├- CaseverListItem
  └- CaseverListItem
*/


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

