var Router = window.ReactRouter;
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var Badge = ReactBootstrap.Badge
var Button = ReactBootstrap.Button
var ButtonGroup = ReactBootstrap.ButtonGroup
var Row    = ReactBootstrap.Row
var Col    = ReactBootstrap.Col
var Grid   = ReactBootstrap.Grid
var Input  = ReactBootstrap.Input
var Label  = ReactBootstrap.Label
var Table  = ReactBootstrap.Table
var Navbar  = ReactBootstrap.Navbar
var CollapsableNav= ReactBootstrap.CollapsableNav
var Nav= ReactBootstrap.Nav
var NavItem= ReactBootstrap.NavItem
var Glyphicon= ReactBootstrap.Glyphicon


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
})

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
})



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


var HistoryReport = React.createClass({
  getInitialState: function(){
    return ({ data: null })
  },

  componentDidMount: function(){
    var url = "http://127.0.0.1:8000/api/v1/resultview/?format=json&limit=0&runcaseversion__run__series=2" //FIXME: hardcode
    $.ajax({
      url: url,

      success: function(data) {
        this.setState({data: data});
      }.bind(this),

      error: function(xhr, status, err) {
        //this.setState(this.notFound)
        console.error(xhr, status, err.toString());
      }.bind(this)
    });
  },
  
  calcHistory: function(data) {
    //if (data == null) { return (<tr><tb>Loading...</tb></tr>) }
    if (data == null) { return (
      {
        "created_on": 0,
        "name": "Loading...", 
        "passed": 0, 
        "failed": 0,
        "skipped": 0,
        "blocked": 0,
        "invalidated": 0,
      }

    ) }
    var aggr= {}
    data.objects.forEach(function(curr){
      if (typeof aggr[curr.run] == "undefined") {
        aggr[curr.run] = {
          "created_on": curr.created_on, 
          "name": curr.run_name,
          "passed": 0, 
          "failed": 0,
          "skipped": 0,
          "blocked": 0,
          "invalidated": 0,
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
    var history = this.calcHistory(this.state.data);
    var rows = []
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
)

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={HistoryReport}/>
    <NotFoundRoute handler={HistoryReport}/>
  </Route>
);

Router.run(routes, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
})
