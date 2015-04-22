/*******************************************************************************
 *
 * Copyright (c) 2014, Trevor Landau <>
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * Copyright (c) 2014, Trevor Landau <>
 *
 *****************************************************************************/

  function range(start, stop) {
 
  if (arguments.length <= 1) {
    stop = start || 0;
    start = 0;
  }

  var length = Math.max(stop - start, 0);
  var idx = 0;
  var arr = new Array(3);

  while(idx < length) {
    arr[idx++] = start;
    start += 1;
  }

  return arr;
}

/**
 * React Paginator
 *
 * @prop {number} numPages - Available number of pages
 * @prop {number} [maxPages] - Max number of pages to display
 * @prop {function} [onClick] - Fired on every click and passes the page number
 */
var Pagination = React.createClass({
  propTypes: {
    numPages: React.PropTypes.number.isRequired,
    maxPages: React.PropTypes.number,
    onClick: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      maxPages: 10
    };
  },

  getInitialState: function() {
      return {
          page: 1
      };
  },

  /**
   * Triggered by any button click within the paginator.
   *
   * @param {number} n - Page number
   */
  onClick: function(n) {
  // n is out of range, don't do anything
    if (n > this.props.numPages || n < 1) return;
    this.setState({ page: n });
    if (this.props.onClick) this.props.onClick(n);
  },

  /**
   * Returns the number of page numbers
   */
  getDisplayCount: function() {
    if (this.props.numPages > this.props.maxPages) {
      return this.props.maxPages;
    }
    return this.props.numPages;
  },

  /**
   * Returns a range [start, end]
   */
  getPageRange: function() {
        var displayCount = this.getDisplayCount();
    var page = this.state.page;

    // Check position of cursor, zero based
    var idx = (page - 1) % displayCount;

    // list should not move if cursor isn't passed this part of the range
    var start = page - idx;

    // remaining pages
    var remaining = this.props.numPages - page;

    // Don't move cursor right if the range will exceed the number of pages
    // in other words, we've reached the home stretch
    if (page > displayCount && remaining < displayCount) {
      // add 1 due to the implementation of `range`
      start = this.props.numPages - displayCount + 1;
    }

    return range(start, start + displayCount);
  },

  preventDefault: function(e) {
    e.preventDefault();
  },

    render: function() {
    var page = this.state.page;
        var prevClassName = page === 1 ? 'disabled' : '';
        var nextClassName = page >= this.props.numPages ? 'disabled' : '';

    return (
      <ul className='pagination'>
        <li className={prevClassName} onClick={this.onClick.bind(this, page - 1)}>
          <a href='#' onClick={this.preventDefault}><i className='glyphicon glyphicon-chevron-left' /></a>
        </li>
        {this.getPageRange().map(this.renderPage, this)}
        <li className={nextClassName} onClick={this.onClick.bind(this, page + 1)}>
          <a href='#' onClick={this.preventDefault}><i className='glyphicon glyphicon-chevron-right' /></a>
        </li>
      </ul>
    );
    },

  renderPage: function(n, i) {
    var cls = this.state.page === n ? 'pre-active' : '';
    return (
      <li key={i} className={cls} onClick={this.onClick.bind(this, n)}>
        <a href='#' onClick={this.preventDefault}>{n}</a>
      </li>
    );
  }
});
