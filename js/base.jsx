var SearchForm= React.createClass({
  handleSubmit: function(e) {
    console.log('search submitted ' + this.refs.searchbox.getDOMNode().value);
    e.preventDefault();
    console.log(this.props.onSubmit);
    this.props.onSubmit(this.refs.searchbox.getDOMNode().value);
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" id="searchInput" ref="searchbox" defaultValue={this.props.query} />
        <button type="submit" id="searchSubmit">Search</button>
      </form>
    )
  }
});

