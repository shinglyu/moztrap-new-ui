var SearchInput = React.createClass({
  render: function() {
    return (
      <div>
        <input type="text" id="searchInput"/>
        <button id="searchSubmit">Search</button>
      </div>
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
    var casevers = this.props.casevers.map(function(casever){
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
  render: function() {
    return (
      <div>
        <SearchInput />
        <CaseverList casevers={this.props.casevers}/>
      </div>
    )
  }
})

var mockCasevers = [
  {"status": "active", "name": "Foobar!", "productversion": "Firefox OS 2.2"},
  {"status": "draft", "name": "Foobarbar!", "productversion": "Firefox OS 2.1"}
]
React.render(
  <SearchableCaseverList casevers={mockCasevers} />,
  document.getElementById("content")
);
