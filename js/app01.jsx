var CaseverListItem = React.createClass({
  render: function() {
    return (
      <div className="caseverListItem">
        <input type="checkbox"/>
        <div className="status"> Active </div>
        <div className="name"> Fake Name </div>
      </div>
    )
  }
});

var CaseverList = React.createClass({
  render: function() {
    var mockData = [1,2,3]
    var casevers = mockData.map(function(casever){
      return (<CaseverListItem/>)
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

/* 
 + SearchableCaseverList
 ├- SearchForm
 └+ CaseverList
  ├- CaseverListItem
  ├- CaseverListItem
  └- CaseverListItem
*/


