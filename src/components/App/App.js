import React, { Component } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import {playlistName /*, searchResults, , playlistTracks */} from '../../utils/Constants';
import Spotify from '../../utils/Spotify';
import './App.css';


class App extends Component {

  constructor() {
    super();
    this.state = {
      searchResults: [], //searchResults,
      playlistName: playlistName,
      playlistTracks: []// playlistTracks
    };
  }

  componentWillMount() {
    Spotify.initAccessTokenFromURL();
  }

  addTrack = (track) => {
    const {playlistTracks, searchResults} = this.state;

    const index = searchResults.findIndex(e => e.id === track.id);

    searchResults.splice(index, 1);
    playlistTracks.push(track);
    this.forceUpdate();
  }

  removeTrack = (track) => {
    const {playlistTracks, searchResults} = this.state;

    const index = playlistTracks.findIndex(e => e.id === track.id);

    playlistTracks.splice(index, 1);
    searchResults.push(track);
    this.forceUpdate();
  }

  updatePlaylistName = (name) => this.setState({ playlistName: name });

  savePlaylist = () => {
    const trackURIs = this.state.playlistTracks.map(e => e.uri);
    console.log(trackURIs);
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks)
    .then(result => this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    }));
  }

  search = (term) => {
    Spotify.search(term).then(tracks => this.setState({ searchResults: tracks }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />

            <Playlist
              onNameUpdate={this.updatePlaylistName}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onSave={this.savePlaylist}
              playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
