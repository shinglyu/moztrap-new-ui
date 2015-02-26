/* 
 + SearchableCaseverList
 ├- SearchForm
 └+ CaseverList      <== casever injected from here
  ├- CaseverListItem <== access them using this.props.casever
  ├- CaseverListItem
  └- CaseverListItem
*/

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
  render: function() {
    return (
      <form>
        <input type="text" id="searchInput" ref="searchbox" />
        <button type="submit" id="searchSubmit">Search</button>
      </form>
    )
  }
});

var SearchableCaseverList = React.createClass({
  /* 1. This sets the inital this.state */
  getInitialState: function() {
    return {casevers:[{stats: "", name: "Loading..."}]};
  },

  /* 2. Called when the component is mounted to the DOM */
  componentDidMount: function() {
    var onSuccess = function(data){
      /* 3. Update the state*/
      this.setState({casevers: data})
    }
    fakeAJAX("http://moztrap.fake.com", onSuccess, this)
  },

  render: function() {
    return (
      <div>
        <SearchForm/>
        {/* 0. state is used here    vvvvvvvvvvvvvv */}
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

