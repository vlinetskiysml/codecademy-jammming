const Spotify = {};

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
}

const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-library-modify',
  'user-library-read',
]

const client_id = '31ee39ab12b44cdf96652b1c961d13d0';
const redirect_uri = 'http://localhost:3000';

let accessToken = ''; //'BQDhH-1oqWXj8ZfT0XClu3V4dPGYSNTe9rTt5PEiI4GfAwuCBjx0sG7Tncihei21AxGOv-SCbSd-Ghxa3wicT2JM7His8lT4VSU77dHGQKxIu5qzZOciB1TZ6b8NGLtcGTOz3aDTHAWBX-5FevcMKLbu0H6gQ5lBGfz6QvT-bQqNHlF70ea21E_pWS3SuRbGxhU3RMMbRKyKKdhQMHAIUwuJJ8sG7T4nLYKofQ0c7kg2ggxauNGJWp_FAQxqthq1XjYeFLE';

const parseTokenFromURL = (urlStr) => {
 const matches = urlStr.match(/access_token=([^&]*)/);
 if (matches) {
   return matches[1];
 }
 else {
   return null;
 }
}

//parses expiration milliseconds form url
const parseExpirationMSFromURL = (urlStr) => {
 const matches = urlStr.match(/expires_in=([^&]*)/);
 if (matches) {
   return matches[1] * 1000; //convert seconds to milliseconds
 }
 else {
   throw Error;
 }
}

Spotify.initAccessTokenFromURL = () => {
  //check if access token in the url
  const accessTokenFromURL = parseTokenFromURL(window.location.href);
  if (accessTokenFromURL) {
    const expiresIn = parseExpirationMSFromURL(window.location.href);
    accessToken = accessTokenFromURL;
    window.setTimeout(() => accessToken = '', expiresIn);
    window.history.pushState('Access Token', null, '/');

    console.log('Successfully initiated access token');
    return accessToken;
  }

  return null;
}

Spotify.getAccessToken = () => {
  if (accessToken) {
    return accessToken;
  }

  var state = generateRandomString();

  var scope = scopes.join(' ');

  var url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);

  window.location = url;
}


Spotify.search = (term) => {

  const url = `https://api.spotify.com/v1/search?type=track&q=${term}&limit=10`;
  const token = Spotify.getAccessToken();

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to request');
  }, networkError => console.log(`Error: ${networkError}`))
  .then(jsonResponse => {

    const tracks = jsonResponse.tracks.items;
    if (!tracks) {
      return [];
    }

    return tracks.map(track => {
      return {
        id: track.id,
        name: track.name,
        album: track.album.name,
        artist: track.artists[0].name,
        uri: track.uri
      }
    });
  });
}

Spotify.savePlaylist = (playlistName, tracks) => {
  if (!playlistName || !tracks) {
    console.error('Playlist and tracks must have a valid values!');
    return;
  }

  const token = Spotify.getAccessToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const urlUserInfo = "https://api.spotify.com/v1/me";
  const getPlaylistCreationUri = (userId) =>
    `https://api.spotify.com/v1/users/${userId}/playlists`;
  const getPlaylistAddTrackUri = (playlistId) =>
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  //1. first get USER id - its needed to create playlist
  return fetch(urlUserInfo, {
    headers: headers
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to request');
  }, networkError => console.log(`Error: ${networkError}`))
  .then(jsonResponse => jsonResponse.id)
  //2. create playlist for user
  .then(userId => {
    const url = getPlaylistCreationUri(userId);

    //run another fetch and return promise
    return fetch(url, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({name: playlistName})
    })})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to request');
  }, networkError => console.log(`Error: ${networkError}`))
  .then(jsonResponse => jsonResponse.id) //playlist id
  //3. save tracks in a playlist
  .then(playlistId => {
    const url = getPlaylistAddTrackUri(playlistId);

    console.log(`Playlist add tracks url: ${url}`);
    //run another fetch and return promise
    return fetch(url, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({uris: tracks.map(e => e.uri)})
    });
  }); //just return promise to track when PL creation is completed
}

export default Spotify;
