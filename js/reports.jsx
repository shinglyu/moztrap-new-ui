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

var Aggr;

var Header = React.createClass({
    render: function() {
    return (
      <Navbar brand="MozTrap+" inverse toggleNavKey={0}>
        <Nav navbar>
          <NavItem eventKey={1} href="index.html">Case</NavItem>
          <NavItem eventKey={2} href="index.html#/suite">Suite</NavItem>
          <NavItem eventKey={3} href="reports.html">Results</NavItem>
        </Nav>
        <Nav navbar right>
          <NavItem eventKey={4} href="#/settings"><Glyphicon glyph="cog"/></NavItem>
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
      <div id="mbars"/>
      <Footer/>
      </Grid>
      </div>
    )
    }
});

var SearchForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var runSeriesName = this.refs.searchbox.getDOMNode().value;
        /* 1. Call the parent's search handler */
        this.props.getResultData(runSeriesName);
    },
    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <table>
                <tr>
                    <td>Product</td>
                    <td><GetProductList productNameData={this.props.productNameData} productNameOnChange={this.props.productNameOnChange} updateCurrentProductName={this.updateCurrentProductName}/></td>
                    <td>Product Version</td>
                    <td><GetProductVersionList productVersionData={this.props.productVersionData} productVersionOnChange={this.props.productVersionOnChange} updateCurrentProductVersion={this.props.updateCurrentProductVersion}/></td>
                    <td>Name</td>
                    <td><input type="text" id="searchInput" ref="searchbox" /></td>
                </tr>
                <tr>
                    <td>Begin Date</td>
                    <td><UIDatePicker onSelectDate={this.props.updateBeginDate}/></td>
                    <td>End Date</td>
                    <td><UIDatePicker onSelectDate={this.props.updateEndDate}/></td>
                    <td></td>
                    <td><button type="submit" id="searchSubmit">Search</button></td>
                </tr>
                </table>
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
        var currentDate = new Date();
        return ({ resultData: null,
            currentProductName: null,
            currentProductVersion: null,
            productNameData: null,
            productVersionData: null,
            isInitProductVersion: false,
            beginDate:currentDate,
            endDate:currentDate
        })
    },

    componentDidMount: function(){
        this.getProductData()
    },

    componentDidUpdate: function(){
        if (this.state.isInitProductVersion == false) {
            this.getProductVersionData(this.state.productNameData.objects[0].name);
            this.setState({isInitProductVersion:true});
        }
        if (this.state.resultData != null) {
          var history = this.calcHistory(this.state.resultData);
          createCharts(history);
        }
    },

    getResultData: function(name) {
        var url ="";
        if (name == ""){
            url = config.baseUrl + "/api/v1/resultview/?format=json&limit=0&runcaseversion__run__productversion__product__name=" + this.state.currentProductName + "&runcaseversion__run__productversion__version=" + this.state.currentProductVersion + "&created_on__gte=" + moment(this.state.beginDate).format('YYYY-MM-DD') + "&created_on__lte=" + moment(this.state.endDate).format('YYYY-MM-DD')
        }else{
            url = config.baseUrl + "/api/v1/resultview/?format=json&limit=0&runcaseversion__run__productversion__product__name=" + this.state.currentProductName + "&runcaseversion__run__productversion__version=" + this.state.currentProductVersion + "&created_on__gte=" + moment(this.state.beginDate).format('YYYY-MM-DD') + "&created_on__lte=" + moment(this.state.endDate).format('YYYY-MM-DD') + "&runcaseversion__run__name__contains=" + name
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
        var url = config.baseUrl + "/api/v1/product/?format=json&limit=0";
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
        var url = config.baseUrl + "/api/v1/productversion/?format=json&limit=0&product__name=" + name ;
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

    updateBeginDate: function(date){
        if (this.state.beginDate == null || this.state.beginDate != date){
            this.setState({beginDate:date})
        }
    },

    updateEndDate: function(date){
        if (this.state.endDate == null || this.state.endDate != date){
            this.setState({endDate:date})
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
                <th colSpan="8"><SearchForm productNameData={this.state.productNameData}
                                            productNameOnChange={this.productNameOnChange}
                                            updateCurrentProductName={this.updateCurrentProductName}
                                            productVersionData={this.state.productVersionData}
                                            productVersionOnChange={this.productVersionOnChange}
                                            updateCurrentProductVersion={this.updateCurrentProductVersion}
                                            getResultData={this.getResultData}
                                            updateBeginDate={this.updateBeginDate}
                                            updateEndDate={this.updateEndDate}/></th>

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

var UIDatePicker = React.createClass({
    getInitialState: function(){
        return ({ myDatepicker: Datepicker.noConflict()
        })
    },
    render: function(){
        return(
            React.createElement(this.state.myDatepicker, {
                onSelect: function(date) {
                    this.props.onSelectDate(date);
                }.bind(this)
            })
        )
    }
});

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
