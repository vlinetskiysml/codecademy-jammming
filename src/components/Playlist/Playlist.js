import React, {Component} from 'react';
import TrackList from '../TrackList/TrackList';
import * as TrackListTypes from '../TrackList/TrackListTypes';
import './Playlist.css';


class Playlist extends Component {

  handleNameChange = e => {
    this.props.onNameUpdate(e.target.value);
    e.preventDefault();
  }

  render() {
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange}/>
        <TrackList
          tracks={this.props.playlistTracks}
          type={TrackListTypes.DESTINATION_TRACKLIST}
          trackMoveAction={this.props.onRemove}
          />
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
