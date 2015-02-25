/* 
 + SearchableCaseverList <== casevers injected from here
 ├- SearchForm
 └+ CaseverList      <== casevers accessed here, inject each into CaseverListItem as casever
  ├- CaseverListItem <== casever accessed here
  ├- CaseverListItem
  └- CaseverListItem
*/

var CaseverListItem = React.createClass({
  render: function() {
    return (
      <div className="caseverListItem">
        <input type="checkbox"/>
        {/* 2 access             vvvvvvvvvvvvvvvvvvvvvvvvv*/}
        <div className="status">{this.props.casever.status}</div> 
        <div className="name">{this.props.casever.name}</div>
      </div>
    )
  }
});

var CaseverList = React.createClass({
  render: function() {
    
    /* 1 access    vvvvvvvvvvvvvvvvvvv*/
    var casevers = this.props.casevers.map(function(casever){
      {/* 2 set                vvvvvvvvvvvvvvvvv*/}
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
  data: [
      {status: "active", name:"item 01"},
      {status: "active", name:"item 02"},
      {status: "active", name:"item 03"},
    ],
  render: function() {
    return (
      <div>
        <SearchForm/>
        {/* 1 set    vvvvvvvvvvvvvvvvvvvv*/}
        <CaseverList casevers={this.data}/>
      </div>
    )
  }
})


React.render(<SearchableCaseverList/>, document.body);


