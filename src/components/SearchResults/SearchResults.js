import React, {Component} from 'react';
import TrackList from '../TrackList/TrackList';
import * as TrackListTypes from '../TrackList/TrackListTypes';
import PropTypes from 'prop-types';
import "./SearchResults.css";

class SearchResults extends Component {

  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList
          tracks={this.props.searchResults}
          type={TrackListTypes.SOURCE_TRACKLIST}
          trackMoveAction={this.props.onAdd}
          />
      </div>
    );
  }
}

SearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default SearchResults;
