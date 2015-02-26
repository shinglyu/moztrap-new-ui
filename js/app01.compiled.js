var CaseverListItem = React.createClass({displayName: "CaseverListItem",
  render: function() {
    return (
      React.createElement("div", {className: "caseverListItem"}, 
        React.createElement("input", {type: "checkbox"}), 
        React.createElement("div", {className: "status"}, " Active "), 
        React.createElement("div", {className: "name"}, " Fake Name ")
      )
    )
  }
});

var CaseverList = React.createClass({displayName: "CaseverList",
  render: function() {
    var mockData = [1,2,3]
    var casevers = mockData.map(function(casever){
      return (React.createElement(CaseverListItem, null))
    }.bind(this))

    return (
      React.createElement("div", {className: "caseverList"}, 
        casevers
      )
    )
  }
});

var SearchForm = React.createClass({displayName: "SearchForm",
  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("input", {type: "text", id: "searchInput", ref: "searchbox"}), 
        React.createElement("button", {type: "submit", id: "searchSubmit"}, "Search")
      )
    )
  }
});

var SearchableCaseverList = React.createClass({displayName: "SearchableCaseverList",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(SearchForm, null), 
        React.createElement(CaseverList, null)
      )
    )
  }
})


React.render(React.createElement(SearchableCaseverList, null), document.body);

/* 
 + SearchableCaseverList
 ├- SearchForm
 └+ CaseverList
  ├- CaseverListItem
  ├- CaseverListItem
  └- CaseverListItem
*/
