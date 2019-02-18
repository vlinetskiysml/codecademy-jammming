import React, {Component} from 'react';
import Track from '../Track/Track';
import * as TrackListTypes from './TrackListTypes';
import './TrackList.css';

class TrackList extends Component {

  render() {
    return (
      <div className="TrackList">
          {this.props.tracks.map(track =>
            <Track
              key={track.id}
              track={track}
              isRemoval={this.props.type !== TrackListTypes.SOURCE_TRACKLIST}
              moveAction={this.props.trackMoveAction}/>
          )}
      </div>
    );
  }
}

export default TrackList;
