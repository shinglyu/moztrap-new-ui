var Router = window.ReactRouter;
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var Badge = ReactBootstrap.Badge;
var Button = ReactBootstrap.Button;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Row    = ReactBootstrap.Row;
var Col    = ReactBootstrap.Col;
var Grid   = ReactBootstrap.Grid;
var Input  = ReactBootstrap.Input;
var Label  = ReactBootstrap.Label;
var Table  = ReactBootstrap.Table;
var Navbar  = ReactBootstrap.Navbar;
var CollapsableNav= ReactBootstrap.CollapsableNav;
var Nav= ReactBootstrap.Nav;
var NavItem= ReactBootstrap.NavItem;
var Glyphicon= ReactBootstrap.Glyphicon;
var MozTrapUrl= "10.247.24.79:8000";

var Header = React.createClass({
    render: function() {
    return (
      <Navbar brand="MozTrap+" inverse toggleNavKey={0}>
        <Nav navbar>
          <NavItem eventKey={1} href="#">Case</NavItem>
          <NavItem eventKey={2} href="#/suite">Suite</NavItem>
        </Nav>
        <Nav navbar right>
          <NavItem eventKey={3} href="#/settings"><Glyphicon glyph="cog"/></NavItem>
        </Nav>
      </Navbar>
    )
    }
});

var Footer = React.createClass({
    render: function() {
    return (
      <Row>
        <hr/>
        <a href="https://github.com/shinglyu/moztrap-new-ui/issues">Report Issues</a>
        <span> | </span>
        <a href="https://github.com/shinglyu/moztrap-new-ui/">Source Code</a>
        <span> | </span>
        <a href="mailto://slyu@mozilla.com"><Glyphicon glyph="envelope"/></a>
      </Row>
    )
    }
});

var App = React.createClass({
    render: function() {
    return (
      <div>
      <Header/>
      <Grid>
      <RouteHandler {...this.props}/>
      <Footer/>
      </Grid>
      </div>
    )
    }
});

var SearchForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var runSeriesID = this.refs.searchbox.getDOMNode().value;
        /* 1. Call the parent's search handler */
        this.props.getResultData(runSeriesID);
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

var GetProductList = React.createClass({
    printProducts: function(){
        if (this.props.productNameData != null) {
            return this.props.productNameData.objects.map(function (productInfo){
                return <option id={productInfo.id} value={productInfo.name} label={productInfo.name}>{productInfo.name}</option>;
            }, this);
        }
    },

    componentDidUpdate: function(){
        this.props.updateCurrentProductName(this.refs.productList.getDOMNode().value)
    },

    render: function(){
        var options = this.printProducts();
        return(
            <select id="productList" ref="productList" onChange={this.props.productNameOnChange}>
                {options}
            </select>
        )
    }
});

var GetProductVersionList = React.createClass({
    printProducts: function(){
        if (this.props.productVersionData != null) {
            return this.props.productVersionData.objects.map(function (productInfo){
                return <option id={productInfo.id} value={productInfo.version} label={productInfo.version}>{productInfo.version}</option>;
            }, this);
        }
    },

    componentDidUpdate: function(){
      this.props.updateCurrentProductVersion(this.refs.productVersionList.getDOMNode().value)
    },

    render: function(){
        var options = this.printProducts();
        return(
            <select id="productVersionList" ref="productVersionList" onChange={this.props.productVersionOnChange}>
                {options}
            </select>
        )
    }
});

var HistoryReport = React.createClass({
    getInitialState: function(){
        return ({ resultData: null,
            currentProductName: null,
            currentProductVersion: null,
            productNameData: null,
            productVersionData: null,
            initProductVersionFlag: null
        })
    },

    componentDidMount: function(){
        this.getProductData()
    },

    componentDidUpdate: function(){
        if (this.state.initProductVersionFlag == null) {
            this.getProductVersionData(this.state.productNameData.objects[0].name);
            this.setState({initProductVersionFlag:1});
        }
    },

    getResultData: function(id) {
        var url ="";
        if (id == ""){
            url = "http://"+MozTrapUrl+"/api/v1/resultview/?format=json&limit=0&runcaseversion__run__productversion__product__name=" + this.state.currentProductName + "&runcaseversion__run__productversion__version=" + this.state.currentProductVersion
        }else{
            url = "http://"+MozTrapUrl+"/api/v1/resultview/?format=json&limit=0&runcaseversion__run__productversion__product__name=" + this.state.currentProductName + "&runcaseversion__run__productversion__version=" + this.state.currentProductVersion + "&runcaseversion__run__series=" + id
        }
        $.ajax({
            url: url,
            success: function(data) {
                this.setState({resultData: data});
            }.bind(this),

            error: function(xhr, status, err) {
                //this.setState(this.notFound)
                console.error(xhr, status, err.toString());
            }.bind(this)
        });
    },

    getProductData: function(){
        var url = "http://"+MozTrapUrl+"/api/v1/product/?format=json&limit=0";
        $.ajax({
            url: url,
            success: function(data) {
                this.setState({productNameData: data});
            }.bind(this),

            error: function(xhr, status, err) {
                //this.setState(this.notFound)
                console.error(xhr, status, err.toString());
            }.bind(this)
        });
    },

    getProductVersionData: function(name){
        var url = "http://"+MozTrapUrl+"/api/v1/productversion/?format=json&limit=0&product__name=" + name ;
        $.ajax({
            url: url,
            success: function(data) {
                this.setState({productVersionData: data});
            }.bind(this),
            error: function(xhr, status, err) {
                //this.setState(this.notFound)
                console.error(xhr, status, err.toString());
            }.bind(this)
        });
        this.updateCurrentProductName(name)
    },

    updateCurrentProductName: function(name){
        if (this.state.currentProductName == null || this.state.currentProductName != name){
            this.setState({currentProductName:name})
        }
    },

    updateCurrentProductVersion: function(version){
        if (this.state.currentProductVersion == null || this.state.currentProductVersion != version){
            this.setState({currentProductVersion:version})
        }
    },

    productNameOnChange: function(event){
        var currentProductName = event.target.value;
        this.getProductVersionData(currentProductName)
    },

    productVersionOnChange: function(event){
        var currentProductVersion = event.target.value;
        this.updateCurrentProductVersion(currentProductVersion)
    },

    calcHistory: function(data) {
    //if (data == null) { return (<tr><tb>Loading...</tb></tr>) }
    if (data == null) {
      return (
      [{
        "created_on": 0,
        "name": "Loading...",
        "passed": 0,
        "failed": 0,
        "skipped": 0,
        "blocked": 0,
        "invalidated": 0
      }]

    ) }
    var aggr= {};
    data.objects.forEach(function(curr){
      if (typeof aggr[curr.run] == "undefined") {
        aggr[curr.run] = {
          "created_on": curr.created_on,
          "name": curr.run_name,
          "passed": 0,
          "failed": 0,
          "skipped": 0,
          "blocked": 0,
          "invalidated": 0
        };
        aggr[curr.run][curr.status] = 1;
      }
      else{
        aggr[curr.run][curr.status] += 1 ;
      }
    });

    return aggr
    },

    render: function(){
    var history = this.calcHistory(this.state.resultData);

    var rows = [];
    for (var key in history) {
      var run = history[key];
      rows.push(
        <tr>
          <td>{run.created_on}</td>
          <td>{run.name}</td>
          <td>{run.failed}</td>
          <td>{run.passed}</td>
          <td>{run.skipped}</td>
          <td>{run.blocked}</td>
          <td>{run.invalidated}</td>
          <td>{run.failed + run.passed + run.skipped + run.blocked + run.invalidated}</td>
        </tr>
      )
    }

    //TODO: sort by time, reversed
    return (
        <Col xs={12}>

        <Table striped condensed hover className="caseverList">
            <tbody>
            <tr>
                <th>Product</th>
                <th><GetProductList productNameData={this.state.productNameData} productNameOnChange={this.productNameOnChange} updateCurrentProductName={this.updateCurrentProductName}/></th>
                <th>Product Version</th>
                <th><GetProductVersionList productVersionData={this.state.productVersionData} productVersionOnChange={this.productVersionOnChange} updateCurrentProductVersion={this.updateCurrentProductVersion}/></th>
                <th>Run series</th>
                <th colSpan="3"><SearchForm getResultData={this.getResultData}/></th>
            </tr>
            <tr>
                <th>Run</th>
                <th>Name</th>
                <th>Failed</th>
                <th>Passed</th>
                <th>Skipped</th>
                <th>Blocked</th>
                <th>Invalidated</th>
                <th>Total</th>
            </tr>
            {rows}
          </tbody>
        </Table>
      </Col>


    )

    }

}
);

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={HistoryReport}/>
    <NotFoundRoute handler={HistoryReport}/>
  </Route>
);

Router.run(routes, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
});
