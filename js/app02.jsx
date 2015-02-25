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
        {/* 2. Access the casever={...} property using this.props.casever */}
        <div className="status">{this.props.casever.status}</div> 
        <div className="name">{this.props.casever.name}</div>
      </div>
    )
  }
});

var CaseverList = React.createClass({
  render: function() {
    var mockData = [
      {status: "active", name:"item 01"},
      {status: "active", name:"item 02"},
      {status: "active", name:"item 03"},
    ]
    var casevers = mockData.map(function(casever){
      {/* 1. Injecting data into each <CaseverListItem> */}
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
  render: function() {
    return (
      <div>
        <SearchForm/>
        <CaseverList/>
      </div>
    )
  }
})


React.render(<SearchableCaseverList/>, document.body);


