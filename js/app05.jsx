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
    /* 3. Access the ref="searchbox" by this.refs.searchbox */
    var query = this.refs.searchbox.getDOMNode().value;
    alert("You searched " + query)
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
      {/* 2. Assign the submit handler here*/}
        {/* 1. Set the name as ref="searchbox" vvvvvvvvvvvvvvv*/}
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

  render: function() {
    return (
      <div>
        <SearchForm/>
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

  setTimeout(successCallback.bind(context, fakeData), 2000);
}

