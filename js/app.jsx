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
var Modal= ReactBootstrap.Modal
var ModalTrigger= ReactBootstrap.ModalTrigger

var Header = React.createClass({
  render: function() {
    return (
      <Navbar brand="MozTrap+" inverse toggleNavKey={0}>
        <Nav navbar>
          <NavItem eventKey={1} href="#">Case</NavItem>
          <NavItem eventKey={2} href="#/suite">Suite</NavItem>
          <NavItem eventKey={3} href="reports.html">Results</NavItem>
        </Nav>
        <Nav navbar right>
          <NavItem eventKey={4} href="#/settings"><Glyphicon glyph="cog"/></NavItem>
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

var LoaderOptions = {
    lines: 13,
    length: 20,
    width: 10,
    radius: 30,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: '#000',
    speed: 1,
    trail: 20,
    shadow: false,
    hwaccel: false,
    zIndex: 2e9,
    scale: 1.00
};


var SearchableRemoteListMixin = {
  //need to implement `function buildURL(query) {...}`
  loading: {meta:{}, objects: [{name:"Loading..."}]},
  notFound: {data:{objects:[{name:"Can't find anything. Try loosen the search criteria."}]}},

  updateListUIState: function(data) {
    // 1. Hightlight the loaded page.
    $('li.pre-active').attr('class', 'active'); 

    // 2. Unchecked all boxes.
    if(this.state.type == "case") {
      $.each($('tr th input[type=checkbox]:checked.caseCheckBox, tr td input[type=checkbox]:checked.caseCheckBox'), function () {
        $(this).prop('checked', false);
      });
    }

    if(this.state.type == "suite") {
      $.each($('tr th input[type=checkbox]:checked.suiteCheckBox, tr td input[type=checkbox]:checked.suiteCheckBox'), function () {
        $(this).prop('checked', false);
      });
    }

    // 3. Check boxes whose ID matches checkedIDs.
    var checkedIDs = this.state.caseVerChecked;
    $.each($('tr td input[type=checkbox].caseCheckBox'),
      function() {
        for (var item in checkedIDs) {
          var key = Object.keys(checkedIDs[item]);
          if ($(this).val() == key)
            $(this).prop('checked', true);
        }
    });

    var checkedIDs = this.state['suiteChecked'];
    $.each($('tr td input[type=checkbox].suiteCheckBox'),
        function() {
          for (i = 0; i < checkedIDs.length; i++) {
            if ($(this).val() == checkedIDs[i])
              $(this).prop('checked', true);
          }
        });
  }, 

  loadOnePage: function(url, clickedPageNum) {
    this.setState({ pageLoaded: false });

    clickedPageNum = typeof clickedPageNum !== 'undefined' ? clickedPageNum : 1;
    var limit = typeof this.state.data.meta.limit !== 'undefined' ? 
                this.state.data.meta.limit : 20;
    var selectedPageOffset = (clickedPageNum-1) * limit;
    url = url.replace(/offset=[0-9]+/, "offset=" + selectedPageOffset);

    console.log("===> loadOnePage (Page, URL) = (%d, %s)", clickedPageNum, url);

    $.ajax({
      url: url,
      timeout: 10000, // Force trigger the error callback

      success: function(data) {
        var availablePages = 0;
        if (typeof data.meta.next != 'undefined') {
          availablePages = parseInt(data.meta.total_count / data.meta.limit)
          if (data.meta.total_count % data.meta.limit != 0)
            availablePages += 1;
        }
        this.setState({data: data, queriedPageCount: availablePages, 
                       pageLoaded: true});
        
        this.updateListUIState(data);
      }.bind(this),

      error: function(xhr, status, err) {
        this.setState(this.notFound)
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    var defaultQuery = ""
    if (typeof this.props.params !== "undefined" && 
        typeof this.props.params.query !== "undefined") {
      defaultQuery = this.props.params.query;
    } else {
      defaultQuery = "product:\"" + config.defaultProduct + "\"";
    }

    var type = "";
  
    return {query: defaultQuery, data: this.loading, caseVerChecked: [], caseChecked: [], 
            suiteChecked: [], queriedPageCount: 0, type:type, pageLoaded: false};
  },

  componentDidMount: function() {
    this.loadOnePage(this.buildURL(this.state.query));
  }, 
  
  handleSearch: function(query) { 
    console.log(query)
    this.loadOnePage(this.buildURL(query));
    this.setState({query: query, data: this.loading});
    //TODO: two way data binding?
    //console.log("handle search: " + query)
    if(!this.state.disableQueryURL) {
      this.refs.searchform.forceUpdateInput(query);
      window.history.pushState({}, "MozTrap", document.URL.split("search/")[0] + "search/" + encodeURI(query));
    }
  },

  handleAddCases: function(){
    /***  the data structure of caseVerChecked & caseChecked queues
    caseVerChecked queue = [{"172000":{"/api/v1/case/15973/":"Test case name."}},
                            {"172001":{"/api/v1/case/15974/":"Test case name 2"}}
                           ]
    caseChecked queue = [{"/api/v1/case/15973/":"Test case name."},
                         {"/api/v1/case/15974/":"Test case name 2"}
                        ]
    ***/
    //remove all items
    var caseChecked = this.state.caseChecked;
    if(caseChecked.length>0) {
      //var caseChecked = this.state.caseChecked;
      for (var index in caseChecked) {
        caseChecked.splice(0, caseChecked.length);
      }
      console.log("-----clean caseChecked queue");
    }
    if(this.state.type=='case') {
      var nonExisted = true;
      for(var index in this.state.caseVerChecked){
        nonExisted = true;
        var caseVerKey    = Object.keys(this.state.caseVerChecked[index]);
        var caseVerSecKey = Object.keys(this.state.caseVerChecked[index][caseVerKey]);
        for (var caseItem in caseChecked) {
          var caseKey = Object.keys(this.state.caseChecked[caseItem]);
          if (caseVerSecKey.toString() == caseKey.toString()){
            nonExisted = false;
          }
        }
        if(nonExisted){
          var obj = {};
          obj[caseVerSecKey] = this.state.caseVerChecked[index][caseVerKey][caseVerSecKey];
          caseChecked.push(obj);
        }
      }
      this.setState({ caseChecked: caseChecked });
    }
  },

  handlePageLoading: function(page) {
    this.setState({pageLoaded: false});

    if (this.state.data.meta.previous)
      this.loadOnePage(config.baseUrl + this.state.data.meta.previous, page);
    else if (this.state.data.meta.next)
      this.loadOnePage(config.baseUrl + this.state.data.meta.next, page);
    else
      console.error(this.state.data, status, err.toString());
  },

  handleAddFilter: function(additionalQuery, removeRegex){
    var newQuery = this.state.query.replace(removeRegex, "")
    console.log(newQuery)
    this.handleSearch(newQuery + additionalQuery);
  },

  getStatusIcon: function(status){
    if(status=="active")
      return <Glyphicon glyph="ok-sign"/>
    else if (status == "draft")
      return <Glyphicon glyph="minus-sign"/>
    else (status == "disabled")
    return <Glyphicon glyph="remove-sign"/>
  },
}

var SearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.searchbox.getDOMNode().firstChild.value);

    /* queryString =
     *   tagged strings under $(".text-tags .text-label")
     *   + non tagged strings except space
     */
  /* backed out due to imcomplete autocomplete feature
    var allNodes = $(this.refs.searchbox.getDOMNode()).find(".text-tags .text-label"),
	length = allNodes.length,
        queryString = "",
	nonTagQueryString = $(this.refs.searchbox.getDOMNode()).find("#searchInput")[0].value   //FIXME: might have some issues
        ;

    for (var i=0; i< length; i++) {
	queryString = queryString + " " + allNodes[i].innerHTML;
    }

    if(!nonTagQueryString.match(/\s+^[\S]/)) {
	queryString = queryString + " " + nonTagQueryString;
    }

    console.log("query: " + queryString);
    this.props.onSubmit(queryString);
  */
  },
  componentDidMount: function() {
    //initAutocomplete(this.props.parentId); //disabling autocomplele before it's stable
  },
  forceUpdateInput: function(query){
    //console.log(this.refs.searchbox.getDOMNode())
    this.refs.searchbox.getDOMNode().firstElementChild.value = query;
  },
  render: function() {
    if (typeof this.props.syntaxlink !== "undefined") {
        var helplink = <small>(<a href={this.props.syntaxlink} target="_blank">help</a>)</small>;
    }
    return (
      <Row>
      <form onSubmit={this.handleSubmit}>
        <Col xs={10} md={10}>
        <Input type="text" id="searchInput" ref="searchbox" defaultValue={this.props.query} />
        </Col>
        <Col xs={2} md={2}>
        <Button bsStyle="primary" type="submit" id="searchSubmit">Search</Button>
        {helplink}
        </Col>
      </form>
      </Row>
    )
  }
});

var PaginationContainer = React.createClass({
   getInitialState: function() {
     return {
       maxDisplayPages: 10,
       totalPageCount: 0
     };
   },
 
   render: function() {
   return  (
     <div id="react-paginator">
       <Pagination numPages={this.props.totalPageCount} maxDisplayPages={this.props.maxDisplayPages} onClick={this.props.onPageSelected}/>
     </div>
     );
   }

});

var AddToSuitePopWindow = React.createClass({

  getInitialState: function(){
    return ({
      suiteQueue: []
    })
  },

  updateSuiteNumber: function(checked,id) {

    if (checked == "true") {
      if (this.state.suiteQueue.indexOf(id) == -1) {
        var tmp = this.state.suiteQueue;
        tmp.push(id);
        this.setState({suiteQueue:tmp});
      }
    }
    else {
      var tmp = this.state.suiteQueue;
      tmp.splice(this.state.suiteQueue.indexOf(id), 1);
      this.setState({suiteQueue:tmp});
    }

    if(this.state.suiteQueue.length>0)
      this.setState({addDisabled:false});
  },

  addToSuite: function(){
    function addSuiteCase(that) {
      //console.log(addDatum)
      if (addDatum.length == 0) { //update state to trigger refresh
        that.setState({addQueue:[]}); //Cleanup the add queue
        return;
      }
      size = addDatum.length;
      for (i = 0; i < size; i++) {
        var data = addDatum.pop()
        for(j=0; j< data.length;j++){
          console.log(JSON.stringify(data[j]));
         $.ajax({
            type: "POST",
            url: config.baseUrl + "/api/v1/suitecase/?username=" + config.username + "&api_key=" + config.api_key,
            contentType:"application/json",
            data: JSON.stringify(data[j]),
            success: function(data){
              console.log(data)
              addSuiteCase(that)
            }.bind(this),

            error: function(xhr, status, err) {
               console.error(xhr, status, err.toString());
            }.bind(this)
         });
        }
      }
    }

    var addDatum = this.state.suiteQueue.map(function(resource_uri){
      return(
      this.props.queue.map(
          function(caseuri){
            return ({case: Object.keys(caseuri)[0],
                     suite:resource_uri})
          }))
        }, this)

    addSuiteCase(this);
    this.props.checkAll("false");
    this.props.onRequestHide();
  },

  render: function(){
    if (typeof this.props.queue !== "undefined"){
      var tags = this.props.queue.map(function(caseitem){
        console.log(caseitem);
        var caseURI = Object.keys(caseitem);
        var caseDescription = caseitem[caseURI][1];
        return (<tr><td>{caseURI}</td><td>{caseDescription}</td> </tr>)
      }.bind(this),this)
    }

    var addDisabled = true;
    if (typeof this.state.suiteQueue != "undefined") {
      if (this.state.suiteQueue.length > 0) {
        var addDisabled = false;
      }
    }

    return(
        <Modal bsSize='large'>
          <div className='modal-body'>
            <Col sm='12'>
              <Row>
                <Col sm='12'>
                  <Table striped condensed hover>
                    <tbody>
                      <tr>
                        <th>ID</th>
                        <th>name</th>
                      </tr>
                      {tags}
                      <tr>
                        <td><Button bsStyle='primary' disabled={addDisabled} onClick={this.addToSuite}>Submit</Button></td>
                        <td><Button bsStyle='warning' onClick={this.props.onRequestHide}>Close</Button></td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <SearchableSuiteList onUpdate={this.updateSuiteNumber}/>
              </Row>
            </Col>
          </div>
        </Modal>
    )
  }
});

var ModifyPriorityPopWindow = React.createClass({
  getInitialState: function(){
    return ({
      priority: ''
    })
  },

  updatePriority: function(updatedPriority) {
    if (updatedPriority == '0') {
      updatedPriority = null;
    }
    this.setState({priority:updatedPriority});
  },

  modifyPriority: function(){
    function modifyPriorityCase(that) {
      if (modifyDatum.length == 0) {
        that.props.onUnmount(that.props.query);
        return;
      }
      size = modifyDatum.length;
      for (i = 0; i < size; i++) {
        var data = modifyDatum.pop();
        $.ajax({
          type: "PUT",
          url: config.baseUrl + data["case"] + "?username=" + config.username + "&api_key=" + config.api_key,
          contentType:"application/json",
          data: "{\"priority\": " + that.state.priority + "}",
          success: function(data){
            console.log(data)
            modifyPriorityCase(that)
          }.bind(this),

          error: function(xhr, status, err) {
            console.error(xhr, status, err.toString());
          }.bind(this)
        });
      }
    }

    var modifyDatum = this.props.queue.map(
      function(caseuri){
        return ({case: Object.keys(caseuri)[0]
          })
      })

    modifyPriorityCase(this);
    this.props.checkAll("false");
    this.props.onRequestHide();
  },

  render: function(){
    if (typeof this.props.queue !== "undefined"){
      var tags = this.props.queue.map(function(caseitem){
        console.log(caseitem);
        var caseURI = Object.keys(caseitem);
        var caseDescription = caseitem[caseURI][1];
        return (<tr><td>{caseURI}</td><td>{caseDescription}</td> </tr>)
      }.bind(this),this)
    }

    var modifyDisabled = true;
    if (this.state.priority != '') {
      modifyDisabled = false;
    }

    return(
      <Modal bsSize='large'>
        <div className='modal-body'>
          <Col sm="12">
            <Row>
              <Col sm="12">
                <Table striped condensed hover>
                  <tbody>
                    <tr>
                      <th>ID</th>
                      <th>name</th>
                    </tr>
                      {tags}
                    <tr>
                      <td><Button id='modifySubmit' bsStyle='primary' disabled={modifyDisabled} onClick={this.modifyPriority}>Submit</Button></td>
                      <td><Button bsStyle='warning' onClick={this.props.onRequestHide}>Close</Button></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row>
            <PriorityList onUpdate={this.updatePriority}/>
            </Row>
          </Col>
        </div>
      </Modal>
    )
  }
});

var ModifyTagPopWindow = React.createClass({

  getInitialState: function(){
    return ({
      addTagNameList: [],
      removeTagNameList: []
    })
  },

  updateAddTagNameList: function(updatedAddTagNameList){
    this.setState({addTagNameList:updatedAddTagNameList});
  },

  updateRemoveTagNameList: function(updatedRemoveTagNameList){
    this.setState({removeTagNameList:updatedRemoveTagNameList});
  },

  modifyTags: function(){
    function diffTagName(subTagNameList, tagNameList) {
      subTagNameList = subTagNameList.filter(function(element) {
        return tagNameList.indexOf(element) < 0;
      });

      return subTagNameList;
    }

    function verifyTag(tagList) {
      var deferred = $.Deferred();
      var query = tagList.join('&name__in=');

      $.ajax({
        type: "GET",
        url: config.baseUrl + "/api/v1/tag?format=json&name__in=" + query,
        success: function(data){
          console.log(data);

          var verifiedTagList = [];
          for (var i = 0; i < data['objects'].length; i++) {
            verifiedTagList.push([data['objects'][i]['name'], data['objects'][i]['resource_uri']]);
          }

          deferred.resolve(verifiedTagList);
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
          deferred.reject();
        }.bind(this)
      });

      return deferred.promise();
    }

    function createTag(nonexistTagNameList) {
      var deferred = $.Deferred();

      if (nonexistTagNameList.length == 0) {
        deferred.resolve();
        return deferred.promise();
      }

      var tag = {};
      tag['name'] = nonexistTagNameList.pop();

      $.ajax({
        type: "POST",
        url: config.baseUrl + "/api/v1/tag/?username=" + config.username + "&api_key=" + config.api_key,
        contentType:"application/json",
        data: JSON.stringify(tag),
        success: function(data){
          console.log(data);
          $.when(createTag(nonexistTagNameList)).then(function () {
            deferred.resolve();
          });
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
          deferred.reject();
        }.bind(this)
      });

      return deferred.promise();
    }

    function updateCaseTag(addTagNameList, removeTagNameList) {
      var deferred = $.Deferred();

      if (modifyDatum.length == 0) {
        deferred.resolve();
        return deferred.promise();
      }

      var datum = modifyDatum.pop();
      $.ajax({
        type: "GET",
        url: config.baseUrl + "/api/v1/caseversion/" + datum["caseverid"] + "?format=json",
        success: function(data){
          console.log(data);

          var caseTag = [];
          for (var i = 0; i < data['tags'].length; i++) {
            caseTag.push(data['tags'][i]['name']);
          }
          $.when(addAndRemoveTags(caseTag, addTagNameList, removeTagNameList,
            datum["caseverid"])).then(function () {
            return updateCaseTag(addTagNameList, removeTagNameList)
          }).then(function () {
            deferred.resolve();
          });
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
          deferred.reject();
        }.bind(this)
      });

      return deferred.promise();
    }

    function addAndRemoveTags(caseTag, addTagNameList, removeTagNameList, caseverid) {
      var updateTagNameList = caseTag;
      var deferred = $.Deferred();

      if (updateTagNameList.length == 0) {
        updateTagNameList = addTagNameList;
      } else {
        for (var i = 0; i < addTagNameList.length; i++) {
          for (var j = 0; j < updateTagNameList.length; j++) {
            if (updateTagNameList[j] == addTagNameList[i]) {
              break;
            } else if (j == updateTagNameList.length - 1) {
              updateTagNameList.push(addTagNameList[i]);
            }
          }
        }
      }

      updateTagNameList = updateTagNameList.filter(function(element) {
        return removeTagNameList.indexOf(element) < 0;
      });

      $.when(verifyTag(updateTagNameList)).then(function (verifiedTagList) {
        var updateTagUriList = {};
        updateTagUriList['tags'] = [];
        for (var i = 0; i < verifiedTagList.length; i++) {
          updateTagUriList['tags'].push(verifiedTagList[i][1]);
        }

        $.ajax({
          type: "PUT",
          url: config.baseUrl + "/api/v1/caseversion/" + caseverid + "/?username=" + config.username + "&api_key=" + config.api_key,
          contentType:"application/json",
          data: JSON.stringify(updateTagUriList),
          success: function(data){
            console.log(data);
            deferred.resolve();
          }.bind(this),

          error: function(xhr, status, err) {
            console.error(xhr, status, err.toString());
            deferred.reject();
          }.bind(this)
        });
      });

      return deferred.promise();
    }

    var modifyDatum = this.props.queue.map(
      function(caseuri){
        var key = Object.keys(caseuri)[0];
        return ({caseverid: caseuri[key][0]})
      })

    var diffedAddTagNameList = diffTagName(this.state.addTagNameList, this.state.removeTagNameList);
    var diffedRemoveTagNameList = diffTagName(this.state.removeTagNameList, this.state.addTagNameList);

    var checkAll = this.props.checkAll;
    var onRequestHide = this.props.onRequestHide;
    var onUnmount = this.props.onUnmount;
    var query = this.props.query;

    $.when(verifyTag(diffedAddTagNameList)).then(function (verifiedTagList) {
      var existTagNameList = [];
      for (var i = 0; i < verifiedTagList.length; i++) {
        existTagNameList.push(verifiedTagList[i][0]);
      }

      var nonexistTagNameList = diffTagName(diffedAddTagNameList, existTagNameList);
      return createTag(nonexistTagNameList);
    }).then(function () {
      return updateCaseTag(diffedAddTagNameList, diffedRemoveTagNameList);
    }).then(function () {
      checkAll("false");
      onRequestHide();
      onUnmount(query);
    });
  },

  render: function(){
    if (typeof this.props.queue !== "undefined"){
      var tags = this.props.queue.map(function(caseitem){
        console.log(caseitem);
        var caseURI = Object.keys(caseitem);
        var caseDescription = caseitem[caseURI][1];
        return (<tr><td>{caseURI}</td><td>{caseDescription}</td> </tr>)
      }.bind(this),this)
    }

    var modifyDisabled = true;
    if (this.state.addTagNameList.length != 0 || this.state.removeTagNameList.length != 0) {
      modifyDisabled = false;
    }

    return(
        <Modal bsSize='large'>
          <div className='modal-body'>
            <Col sm='12'>
              <Row>
                <Col sm='12'>
                  <Table striped condensed hover>
                    <tbody>
                      <tr>
                        <th>ID</th>
                        <th>name</th>
                      </tr>
                      {tags}
                      <tr>
                        <td><Button id='modifySubmit' bsStyle='primary' disabled={modifyDisabled} onClick={this.modifyTags}>Submit</Button></td>
                        <td><Button bsStyle='warning' onClick={this.props.onRequestHide}>Close</Button></td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <TagList id="addTagNameList" onUpdate={this.updateAddTagNameList}/>
                <TagList id="removeTagNameList" onUpdate={this.updateRemoveTagNameList}/>
              </Row>
            </Col>
          </div>
        </Modal>
    )
  }
});

//TODO: using client side sort for now, use this when two way data binding is OK
var SortableTh = React.createClass({
  handleSort: function(){
    //alert('sort by ' + this.props.name)
    var newOrder = null 
    if (this.state.order == ""){
        newOrder = "-"
    }
    else if (this.state.order == "-"){
        newOrder = ""
    }
    else {
        newOrder = ""
    }
    this.setState({"order": newOrder})
    this.props.handleAddFilter(' orderby:' + newOrder + this.props.filter, / orderby:[-\w]+/)
  },
  getInitialState: function(){
    return ({"order": null}) //+ and -
  },
  render: function(){
    var marker=""
    if (this.state.order == ""){
      marker = "▼";
    }
    else if (this.state.order == "-"){
      marker = "▲";
    }
    return(
      <th className="thSortable" id={"orderby_"+ this.props.filter} onClick={this.handleSort}>{this.props.name}{marker}</th>
    )
  }
})

var CaseverListItem = React.createClass({
  handleTagClick: function(e){
    tagname = e.target.innerHTML;
    this.props.handleAddFilter(" tag:\"" + tagname + "\"");
  },

  printCheckboxes: function(){
    if ( this.props.caseVerQueue.length != 0){
      var Existed=false;
      for(var index in this.props.caseVerQueue) {

      var key = Object.keys(this.props.caseVerQueue[index]);
        if (key == this.props.casever.id.toString()) {
          Existed=true;
        }
      }
      if(Existed)
        return <input type="checkbox" className="caseCheckBox" data-casename={this.props.casever.name} data-caseid={this.props.casever.case} value={this.props.casever.id} checked onChange={this.props.onChange}/>
      else
        return <input type="checkbox" className="caseCheckBox" data-casename={this.props.casever.name} data-caseid={this.props.casever.case} value={this.props.casever.id} onChange={this.props.onChange}/>
    }
    else{
        return <input type="checkbox" className="caseCheckBox" data-casename={this.props.casever.name} data-caseid={this.props.casever.case} value={this.props.casever.id} onChange={this.props.onChange}/>
    }
  },

  render: function() {
    var detailUrl = config.baseUrl + "/manage/cases/_detail/" + this.props.casever.id;
    // Formatting tags
    // TODO: make each tag a div
    if (typeof this.props.casever.tags !== "undefined"){
      var tags = this.props.casever.tags.map(function(tag){
        return <Badge className="tag" onClick={this.handleTagClick}>{tag.name}</Badge>
      }, this)
    }
    if (typeof this.props.casever.case !== "undefined"){
      var caseId = this.props.casever.case.split('/')[4]
    }
    return (
      <tr className="caseverListItem">
        <td>
          {this.printCheckboxes()}
        </td>
        <td className="id">
          {this.props.casever.id}
        </td>
        <td className="status">
          {this.props.getStatusIcon(this.props.casever.status)}
        </td>
        <td className="name">
          <a href={detailUrl} target="_blank">{this.props.casever.name}</a> <small>{tags}</small>
        </td>
        <td className="priority">
          {this.props.casever.priority}
        </td>
        <td className="productversion">
          {this.props.casever.productversion_name}
        </td>
        <td className="modified_on">
          {this.props.casever.modified_on}
        </td>
        <td className="edit">
          <a title="edit" href={config.baseUrl + "/manage/caseversion/" + this.props.casever.id}>
            <Glyphicon glyph="pencil"/>
          </a>
        </td>
        <td className="sharelink">
          <a title="share link" href={config.baseUrl + "/manage/cases/?filter-id=" + caseId}> 
            <Glyphicon glyph="share"/>
          </a>
        </td>
      </tr>
    )
  }
});


var CaseverList = React.createClass({


  render: function() {
    //can use the casevers.meta
    var casevers = this.props.casevers.objects.map(function(casever){
      return (<CaseverListItem casever={casever} onChange={this.props.handleCheck} handleAddFilter={this.props.handleAddFilter} getStatusIcon={this.props.getStatusIcon} caseVerQueue={this.props.caseVerQueue}/>)
    }.bind(this))

    return (
      <Row>
        <Table striped condensed hover className="caseverList">
          <tbody>
            <tr>
              <td colSpan="9">Total {this.props.casevers.meta.total_count} cases found</td>
            </tr>
            <tr>
              <th><input type="checkbox" className="caseCheckBox" ref="checkAllBox" onChange={this.props.handleCheckAll}/></th>
              <th>ID</th>
              <th className="thStatus">status</th>
              <SortableTh name="name" filter="name" handleAddFilter={this.props.handleAddFilter}></SortableTh>
              <SortableTh name="priority" filter="case__priority"
                          handleAddFilter={this.props.handleAddFilter}></SortableTh>
              <SortableTh name="product" filter="productversion"
                          handleAddFilter={this.props.handleAddFilter}></SortableTh>
              <SortableTh name="modified" filter="modified_on"
                          handleAddFilter={this.props.handleAddFilter}></SortableTh>
              <th></th>
              <th></th>
            </tr>
            {casevers}
          </tbody>
        </Table>
      </Row>
    )
  }
});

var SearchableCaseverList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseversion/",
  //TODO: migrate to api_url: "https://moztrap.mozilla.org/api/v1/caseversionsearch/",
  buildURL: function(query) {
      return (buildQueryUrl(this.api_url, query, caseversionCodegen) + 
              "&limit=" + config.defaultListLimit
             );
  },

  checkAll: function(flag) {
    var checkState;
    if(typeof(flag) == 'string'){
      if(flag == "true")
        checkState = true;
      else
        checkState = false;
    }
    else{
      checkState = $('tr th input[type=checkbox].caseCheckBox').prop('checked');
    }

    [].forEach.call(document.querySelectorAll('input[type=checkbox].caseCheckBox'), function(checkbox){
      if (checkState == true) {
        checkbox.checked = true;
      }
      else
        checkbox.checked = false;
    }.bind(this));

    var nonExisted = true;
    var caseVerChecked = this.state.caseVerChecked;
    if (checkState == true){
      this.state.data.objects.map(function(casever){
        nonExisted = true;
        for(var index in caseVerChecked) {
          if( Object.keys(caseVerChecked[index])== casever.id.toString()){
            nonExisted = false;
          }
        }
        if(nonExisted){
          var obj = {};
          var valueObj = {};
          valueObj[casever.case.toString()] = [casever.id, casever.name];
          obj[casever.id.toString()] = valueObj;
          caseVerChecked.push(obj);
        }
      }.bind(this))
    }
    else
    {
      var casevers = this.state.data.objects.map(function(casever){
        for(var index in caseVerChecked) {
          if( Object.keys(caseVerChecked[index])== casever.id.toString()){
            //console.log("yes");
            //console.log("remove key: "+casever.id.toString());
            //console.log("item = "+ caseVerChecked[index][casever.id.toString()]);
            caseVerChecked.splice(index, 1);
          }
        }
      }.bind(this))
    }

    this.setState({ caseVerChecked: caseVerChecked });
    console.log("caseVerChecked:"+this.state.caseVerChecked);
    console.log("Casever Queue Length:"+this.state.caseVerChecked.length);

  },

  handleQueueUpdate: function(e) {
    var caseVerChecked = this.state.caseVerChecked;
    if (e.target.checked) {
      if(caseVerChecked[e.target.value] == null){
        var obj = {};
        var valueObj = {};
        valueObj[e.target.getAttribute('data-caseid')] = [e.target.value, e.target.getAttribute('data-casename')];
        obj[e.target.value.toString()] = valueObj;
        caseVerChecked.push(obj);
      }
    }
    else {
      for(var index in caseVerChecked) {
        if( Object.keys(caseVerChecked[index])== e.target.value){
          caseVerChecked.splice(index, 1);
        }
      }
    }
    this.setState({ caseVerChecked: caseVerChecked });
    //console.log("===> handleQueueUpdate - CaseVersion: ", this.state.caseVerChecked);
    console.log("Casever Queue Length:"+this.state.caseVerChecked.length);
  },

  render: function() {
    var diffURL = ""
    var diffDisabled = true, addDisabled = true;
    if (typeof this.state.caseVerChecked != "undefined"){
      console.log(diffURL);
      if (this.state.caseVerChecked.length == 2){
        var diffDisabled = false;
        diffURL = "diff.html?lhs=" + Object.keys(this.state.caseVerChecked[0]) + "&rhs=" + Object.keys(this.state.caseVerChecked[1]);
        console.log("diffURL: "+diffURL);
      }
      if (this.state.caseVerChecked.length > 0){
        var addDisabled = false;
      }
    }

    this.state.type="case";

    return (
      <Col md="12" id="SearchableCaseverList">
        <Row>
          <Col md="12">
          <ButtonGroup id="toolbar"> 
            <Button href={config.baseUrl + '/manage/case/add/'} >+ New Case</Button>
            <ModalTrigger modal={<AddToSuitePopWindow queue={this.state.caseChecked} checkAll={this.checkAll}/>}>
              <Button bsStyle='primary' disabled={addDisabled} onClick={this.handleAddCases}>Add to Suite</Button>
            </ModalTrigger>
            <ModalTrigger modal={<ModifyPriorityPopWindow queue={this.state.caseChecked} checkAll={this.checkAll} onUnmount={this.handleSearch} query={this.state.query}/>}>
              <Button id="modifyPriorityBtn" bsStyle='info' disabled={addDisabled} onClick={this.handleAddCases}>Modify Priority</Button>
            </ModalTrigger>
            <ModalTrigger modal={<ModifyTagPopWindow queue={this.state.caseChecked} checkAll={this.checkAll} onUnmount={this.handleSearch} query={this.state.query}/>}>
              <Button id="modifyTagBtn" bsStyle='primary' disabled={addDisabled} onClick={this.handleAddCases}>Modify Tags</Button>
            </ModalTrigger>
            <Button bsStyle="success" id="diffBtn" target="blank_" href={diffURL}
                    disabled={diffDisabled}>
              diff
            </Button>
          </ButtonGroup>
          </Col>
        </Row>
        <SearchForm ref="searchform" query={this.state.query} onSubmit={this.handleSearch} syntaxlink={"help/syntax_caseversion.html"}/>
        <CaseverList casevers={this.state.data} handleCheckAll={this.checkAll} handleCheck={this.handleQueueUpdate} handleAddFilter={this.handleAddFilter} getStatusIcon={this.getStatusIcon} caseVerQueue={this.state.caseVerChecked} caseQueue={this.state.caseChecked}/>
        <Loader loaded={this.state.pageLoaded} options={LoaderOptions} className="spinner" position="relative" />
        <PaginationContainer onPageSelected={this.handlePageLoading} totalPageCount={this.state.queriedPageCount}/>
      </Col>
    )
  }
})

var SuiteListItem = React.createClass({
  printCheckboxes: function(){
    if ( this.props.queue.length != 0){
      if(this.props.queue.indexOf(this.props.suite.id)!= -1)
        return <input type="checkbox" className="suiteCheckBox" data-suite-uri={this.props.suite.resource_uri} value={this.props.suite.id} checked onChange={this.props.onChange}/>
      else
        return <input type="checkbox" className="suiteCheckBox" data-suite-uri={this.props.suite.resource_uri} value={this.props.suite.id} onChange={this.props.onChange}/>
    }
    else{
      return <input type="checkbox" className="suiteCheckBox" data-suite-uri={this.props.suite.resource_uri} value={this.props.suite.id} onChange={this.props.onChange}/>
    }
  },

  render: function() {
    return (
      <tr className="suiteListItem">
        <td>
          {this.printCheckboxes()}
        </td>
        <td className="id">
          {this.props.suite.id}
        </td>
        <td className="status">
          {this.props.getStatusIcon(this.props.suite.status)}
        </td>
        <td className="name">
          <a href={"./index.html#/caseversion/search/suite:\"" + this.props.suite.name + "\""}>
            {this.props.suite.name}
          </a>
        </td>
        <td className="modified_on">
          {this.props.suite.modified_on}
        </td>
        <td className="edit">
          <a title="edit" href={"./index.html#/suite/" + this.props.suite.id}>
            <Glyphicon glyph="pencil"/>
          </a>
        </td>
        <td className="sharelink">
          <a title="share link" href={config.baseUrl + "/manage/cases/?filter-suite=" + this.props.suite.id}>
            <Glyphicon glyph="share"/>
          </a>
        </td>
      </tr>
    )
  }
});

var SuiteList = React.createClass({
  checkAll: function() {
    var checkState = this.refs.checkAllBox.getDOMNode().checked;
    [].forEach.call(document.querySelectorAll('input[type=checkbox].suiteCheckBox'), function(checkbox){
      if (checkState == true)
        checkbox.checked = true;
      else
        checkbox.checked = false;
    }.bind(this));

    if (checkState == true){
      var suites = this.props.suites.objects.map(function(suite){
        if(this.props.queue.indexOf(suite.id.toString())== -1) {
          this.props.queue.push(suite.id.toString());
          if(this.props.onUpdate!=null){
            this.props.onUpdate("true",suite.resource_uri);
          }
        }
      }.bind(this))
    }
    else
    {
      this.props.suites.objects.map(function(suite){
        this.props.queue.splice(this.props.queue.indexOf(suite.id.toString()), 1);
        if(this.props.onUpdate!=null){
          this.props.onUpdate("false",suite.resource_uri);
        }
      }.bind(this))
    }

    console.log("Suite queue content:" + this.props.queue);
  },

  render: function() {

    var suites = this.props.suites.objects.map(function(suite){
      return (<SuiteListItem suite={suite} onChange={this.props.handleCheck} getStatusIcon={this.props.getStatusIcon} queue={this.props.queue}/>)
    }.bind(this))

    return (
      <Table striped condensed hover className="suiteList">
        <tbody>
          <tr>
            <td colSpan="7">Total {this.props.suites.meta.total_count} suites found</td>
          </tr>
          <tr>
            <th><input type="checkbox" className="suiteCheckBox" ref="checkAllBox" onChange={this.checkAll}/></th>
            <th>ID</th>
            <th className="thStatus">status</th>
            <SortableTh name="name" filter="name" handleAddFilter={this.props.handleAddFilter}></SortableTh>
            <SortableTh name="modified" filter="modified_on"
                        handleAddFilter={this.props.handleAddFilter}></SortableTh>
            <th></th>
            <th></th>
          </tr>
          {suites}
        </tbody>
      </Table>
    )
  }
});

var SearchableSuiteList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/suite/",
  buildURL: function(query) {
      return (buildQueryUrl(this.api_url, query, suiteCodegen) + 
                           "&limit=" + config.defaultListLimit
             );
  },

  handleQueueUpdate: function(e) {
    //***
    console.log("suite handle queue:" + e.target.checked);
    if (e.target.checked) {
      if (this.state.suiteChecked.indexOf(e.target.value) == -1) {
        var suiteChecked = this.state.suiteChecked;
        suiteChecked.push(e.target.value);
        this.setState({ suiteChecked: suiteChecked });
        if(this.props.onUpdate!=null){
          this.props.onUpdate("true",e.target.getAttribute('data-suite-uri'));
        }
      }
    }
    else {
      var suiteChecked = this.state.suiteChecked;
      suiteChecked.splice(suiteChecked.indexOf(e.target.value), 1);
      this.setState({ suiteChecked: suiteChecked });
      if(this.props.onUpdate!=null){
        this.props.onUpdate("false",e.target.getAttribute('data-suite-uri'));
      }
    }
    console.log("selected suite: "+this.state.suiteChecked);
  },

  render: function() {
    this.state.type="suite";
    return (
      <Col md="12" id="SearchableSuiteList">
        <Row>
          <Col md="12">
          <ButtonGroup id="toolbar"> 
            <Button bsStyle="success" href={config.baseUrl + '/manage/suite/add/'} >+ New Suite</Button>
          </ButtonGroup>
          </Col>
        </Row>
        <SearchForm ref="searchform" query={this.state.query} onSubmit={this.handleSearch} syntaxlink={"help/syntax_suite.html"}/>
        <SuiteList suites={this.state.data} handleCheck={this.handleQueueUpdate} handleAddFilter={this.handleAddFilter} onUpdate={this.props.onUpdate} getStatusIcon={this.getStatusIcon} queue={this.state.suiteChecked}/>
        <Loader loaded={this.state.pageLoaded} options={LoaderOptions} className="spinner" position="relative" />
        <PaginationContainer onPageSelected={this.handlePageLoading} totalPageCount={this.state.queriedPageCount} />
      </Col>
    )
  }
});

var PriorityList = React.createClass({
  handlePriorityUpdate: function(e) {
    if (e.target.value >= 0) {
        this.props.onUpdate(e.target.value);
    }
  },

  render: function() {
    return (
      <Col sm="12">
          <Input type='select' name='priorityList' label='Priority' onChange={this.handlePriorityUpdate}>
            <option value=''>-----</option>
            <option value='0'>None</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
          </Input>
      </Col>
    )
  }
});

var TagList = React.createClass({
  componentDidMount: function() {
    var id = this.props.id;
    var update = this.props.onUpdate;

    $('#' + id).textext({ plugins : 'tags' }).on('enterKeyPress backspaceKeyPress', function () {
      update($('#' + id).textext()[0].tags()._formData);
    });
  },

  render: function() {
    return (
      <Col sm='12'>
        <Input id={this.props.id} type="text"/>
      </Col>
    )
  }
});

var CaseListItem = React.createClass({
  render: function() {
    var detailUrl = config.baseUrl + "/manage/cases/_detail/" + this.props.casever.id;
    // Formatting tags
    // TODO: make each tag a div
    if (typeof this.props.casever.tags !== "undefined"){
      var tags = this.props.casever.tags.map(function(tag){return <Badge>{tag.name}</Badge>})//.join(", ")
    }
    if (typeof this.props.casever.case !== "undefined"){
      var caseId = this.props.casever.case.split('/')[4]
    }
    return (
      <tr className="caseListItem">
        <td>
          <input type="checkbox" value={this.props.casever.case} onChange={this.props.onChange}/>
        </td>
        <td className="name">
          <a href={detailUrl} target="_blank">{this.props.casever.name}</a> <small>{tags}</small>
        </td>
        <td className="priority">
          {this.props.casever.priority}
        </td>
        <td className="modified_on">
          {this.props.casever.modified_on}
        </td>
      </tr>
    )
  }
});


var CaseList = React.createClass({
  render: function() {
    //can use the casevers.meta
    var casevers = this.props.casevers.objects.map(function(casever){
      return (<CaseListItem casever={casever} onChange={this.props.handleCheck}/>)
    }.bind(this))

    return (
      <Row>
      <Table striped condensed hover className="caseverList">
        <tbody>
          <tr>
            <th></th>
            <SortableTh name="name" filter="name" handleAddFilter={this.props.handleAddFilter}></SortableTh>
            <SortableTh name="priority" filter="case__priority" handleAddFilter={this.props.handleAddFilter}></SortableTh>
            <SortableTh name="modified" filter="modified_on" handleAddFilter={this.props.handleAddFilter}></SortableTh>
          </tr>
          {casevers}
        </tbody>
      </Table>
      </Row>
    )
  }
});

SearchableCaseSelectionList = React.createClass({
  mixins: [SearchableRemoteListMixin],
  api_url: config.baseUrl + "/api/v1/caseselection/",
  buildURL: function(query) {
      var url = buildQueryUrl(this.api_url, query, caseselectionCodegen);
      url += "&case__suites" + (this.props.isNotIn?"__ne":"") + "=" + this.props.suiteId;
      url += "&limit=" + config.defaultListLimit;
      return url
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.refresh){
      this.loadOnePage(this.buildURL(this.state.query)); //FIXME: this causes unwanted update when checked
    }
  },

  componentDidMount: function() {
    this.loadOnePage(this.buildURL(this.props.query));
  },

  getInitialState: function() {
    return ({disableQueryURL: true, loaded: false});
  },

  render: function() {
    return (
      <div id={this.props.id}>
        <SearchForm ref="searchform" parentId={this.props.id} disableQueryURL={this.state.disableQueryURL} query={this.props.query} onSubmit={this.handleSearch} syntaxlink={"help/syntax_caseselection.html"}/>
        <CaseList casevers={this.state.data} handleCheck={this.props.onCheck}/>
        <Loader loaded={this.state.pageLoaded} options={LoaderOptions} className="spinner" position="relative" />
        <PaginationContainer onPageSelected={this.handlePageLoading} totalPageCount={this.state.queriedPageCount} />
      </div>
    )
  }
});

//FIXME: rename to something like SuiteManagement or similar
var AddToSuite = React.createClass({
  api_url: config.baseUrl + "/api/v1/suite/",
  loadSuite: function(id) {
    $.ajax({
      url: this.api_url + id + "/",

      success: function(data) {
        this.setState({suite: data}); 
        this.refreshQuery(this);
        //FIXME: the sub lists will load itself in the first time, and will reload by this trigger, remove this by adding a refrsh flag in the state
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  
  getInitialState: function() {
    return ({suite: {name: "Loading...", id: this.props.params.id}, 
            addQueue:[], 
            removeQueue:[]
            })
  },

  refreshQuery: function (that) {
    $.ajax({
      url: config.baseUrl + that.state.suite.product + "?format=json",
      success: function(data) {
        this.setState({query: "product:\"" + data.name + "\""});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.loadSuite(this.props.params.id);
  },

  componentWillReceiveProps: function(nextProps) {
    //this.setState{suite: {name: "Loading...", id: this.props.params.id}}
    //this.setState({suite: {id: this.props.params.id}});
    //this.loadSuite(this.props.params.id);
  },

  handleModifySuite: function() {
    //console.log("For suite id: "+  this.state.suite.resource_uri)
    //console.log("You are about to add " + this.state.addQueue.join() + "; Remove " + this.state.removeQueue.join())
    /* Data format example:
      {
        case: "/api/v1/case/1/", //Can log in 
        suite: "/api/v1/suite/3/", //MozTrap bla bla
        order: 0,
      }
    */
    //FIXME: unnessary GET when add or removing cases

    /* Helper functions */
    function postSuiteCase(that) {
      //console.log(addDatum)
      if (addDatum.length == 0) { //update state to trigger refresh
        that.setState({addQueue:[]}); //Cleanup the add queue
        return;
      }
      var data = addDatum.pop()
      $.ajax({
        type: "POST",
        //TODO: ask user for username and apikey
        url: config.baseUrl + "/api/v1/suitecase/?username=" + config.username + "&api_key=" + config.api_key,
        contentType:"application/json",
        data: JSON.stringify(data),
        success: function(data) {
          //console.log("succeeded")
          postSuiteCase(that)
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    }

    function removeSuiteCase(removeDatum, that) {
      if (removeDatum.length == 0) { //update state to trigger refresh
        that.setState({removeQueue:[]}); //Cleanup the add queue
        return;
      }
      var data = removeDatum.pop()
      //Need to remove mtapi.py:198 to make this DELETE work
      $.ajax({
        type: "DELETE",
        //TODO: ask user for username and apikey
        url: config.baseUrl + "/api/v1/suitecase/" + data + "/?permanent=True&username=" + config.username + "&api_key=" + config.api_key,

        success: function(data) {
          removeSuiteCase(removeDatum, that)
        }.bind(this),

        error: function(xhr, status, err) {
          console.error(xhr, status, err.toString());
        }.bind(this)
      });
    }

    /* Add */
    var addDatum = this.state.addQueue.map(function(caseuri){
      return ({
        case: caseuri,
        suite: this.state.suite.resource_uri,
      });
    }, this)

    postSuiteCase(this)

    /* Remove; TODO: make add and remove more simialr*/
    var allSuitecases = undefined;
    var removeSuitecases = undefined;
    var removeDatum = undefined;
    $.ajax({
      type: "GET",
      url: config.baseUrl + "/api/v1/suitecase/?suite=" + this.state.suite.id,

      success: function(data) {
        allSuitecases = data.objects;
        removeSuitecases = allSuitecases.filter(function(sc){ return (this.state.removeQueue.indexOf(sc.case) >= 0);}.bind(this));
        removeDatum = removeSuitecases.map(function(sc) {return sc.id;})
        removeSuiteCase(removeDatum, this)
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.toString());
      }.bind(this)
    });

    /* Cleanup */

    [].forEach.call(document.querySelectorAll('input[type=checkbox]'), function(checkbox){
      checkbox.checked = false;
    });
  },

  handleQueueUpdate: function(e, queueName) {
    if (e.target.checked){
      var newState = {};
      newState[queueName] = this.state[queueName].concat(e.target.value);
      console.log('will set state')
      this.setState(newState);
    }
    else {
      this.state[queueName].splice(this.state[queueName].indexOf(e.target.value), 1);
      var newState = {};
      newState[queueName] = this.state[queueName];
      console.log('will set state')
      this.setState(newState);
    }
  },

  handleAdd: function(e) {
    console.log('handladd')
    this.handleQueueUpdate(e, "addQueue")
  },

  handleRemove: function(e) {
    this.handleQueueUpdate(e, "removeQueue")
  },

  render: function() {
    if (config.username == null || config.username == ""){ //FIXME: maybe set username default as null?
      var credental_not_set_msg = <a href="#/settings">Click to set your username and api key before use</a>
      var credental_not_set = true
    }

    if (typeof(this.state.query) != "undefined") {
      return (
        <Grid>
          <Row>
            <h1>{this.state.suite.name}</h1>
          </Row>
          <Row>
            <Col mdOffset={8}>
              {credental_not_set_msg}
              <Button bsStyle="success" block disabled={credental_not_set} id="modifySuiteTop" onClick={this.handleModifySuite}>Submit</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <h2>Add to suite </h2>
              <SearchableCaseSelectionList isNotIn={true}
                                           suiteId={this.state.suite.id}
                                           onCheck={this.handleAdd}
                                           refresh={this.state.addQueue.length == 0 &&
                                                    this.state.removeQueue.length == 0}
                                           query={this.state.query}
                                           id="ni_list"
                                                  
              />
            </Col>
            <Col xs={12} md={6}>
              <h2>Remove from suite </h2>
              <SearchableCaseSelectionList isNotIn={false}
                                           suiteId={this.props.params.id}
                                           onCheck={this.handleRemove}
                                           refresh={this.state.addQueue.length == 0 && this.state.removeQueue.length == 0}
                                           query={this.state.query}
                                           id="in_list"
              />
            </Col>
          </Row>
        
          <Row>
            <Col mdOffset={8}>
              {credental_not_set_msg}
              <Button bsStyle="success" block disabled={credental_not_set} id="modifySuite" onClick={this.handleModifySuite}>Submit</Button>
            </Col>
          </Row>
        </Grid>
      )
    } else {
        return <div className="emptySearchResults">No results found</div>
    }
  }
})

var Settings = React.createClass({
  getInitialState: function() {
    localforage.getItem('username').then(function(val){
      this.setState({'username':val})
    }.bind(this))
    localforage.getItem('api_key').then(function(val){
      this.setState({'api_key':val})
    }.bind(this))
    return ({'username': "Loading...", 'api_key':"Loading...", 'bsStyle': "primary"});

  },
  handleUpdate: function() {
    var promises = [ ];
    if (this.refs.username.getValue() !== ''){
      promises.push(localforage.setItem('username', this.refs.username.getValue()));//TODO:trim?
    }
    if (this.refs.api_key.getValue() !== ''){
      promises.push(localforage.setItem('api_key', this.refs.api_key.getValue()));
    }
    if (promises.length > 0) {
      Promise.all(promises).then(function(val) {
        refreshConfig();
        this.setState({'bsStyle': "success"});
      }.bind(this));
    }
    this.setState({'buttonStyle': "success"})

  },
  render: function() {
    return (
      <Row>
      <Col md={12}>
        <Input type="text" label="MozTrap Username" id="usernameInput" ref='username' placeholder={this.state.username} />
        <Input type="text" label="API Key" id="apikeyInput" ref='api_key' placeholder={this.state.api_key}/>
        <Button type="submit" id="saveBtn" bsStyle={this.state.bsStyle} onClick={this.handleUpdate}>Save</Button>
      </Col>
      </Row>
    )
  }
})

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={SearchableCaseverList}/>
    <Route name="caseversions"       path="/caseversion" handler={SearchableCaseverList}/>
    <Route name="caseversion_search" path="/caseversion/search/:query" handler={SearchableCaseverList}/>
    <Redirect                        from="/search/:query"  to="/caseversion/search/:query" />
    <Route name="suites_noid"        path="/suite/" handler={SearchableSuiteList}/>
    <Redirect                        from="/suite"  to="/suite/" />
    <Route name="suite_search"       path="/suite/search/:query" handler={SearchableSuiteList}/>
    <Route name="suite"              path="/suite/:id" handler={AddToSuite} />
    <Route name="settings"           path="/settings" handler={Settings} />
    <NotFoundRoute handler={SearchableCaseverList}/>
  </Route>
);

Router.run(routes, function(Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.body);
})
