// Set up the Spotify API endpoint
const SPOTIFY_API = "https://api.spotify.com/v1/";

// Set up the authorization code flow
const CLIENT_ID = "<your client ID>";
const CLIENT_SECRET = "<your client secret>";
const REDIRECT_URI = "<your redirect URI>";
const SCOPES = ["user-read-currently-playing"];
const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

// Set up the access token
let accessToken = null;

// Authenticate with Spotify
function authenticate() {
  // Build the authorization URL
  const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}`;

  // Redirect the user to the authorization URL
  window.location = authUrl;
}

// Get the access token
function getToken(code) {
  // Build the request URL
  const tokenUrl = `${TOKEN_URL}`;

  // Build the request body
  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("code", code);
  body.append("redirect_uri", REDIRECT_URI);
  body.append("client_id", CLIENT_ID);
  body.append("client_secret", CLIENT_SECRET);

  // Make the POST request to get the access token
  fetch(tokenUrl, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      accessToken = data.access_token;
      getNowPlaying();
    })
    .catch((error) => console.error(error));
}

// Get the currently playing track
function getNowPlaying() {
  // Build the request URL
  const nowPlayingUrl = `${SPOTIFY_API}me/player/currently-playing`;

  // Make the GET request to get the currently playing track
  fetch(nowPlayingUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the DOM with the track information
      const trackName = data.item.name;
      const artistName = data.item.artists[0].name;
      const albumArtUrl = data.item.album.images[0].url;
      const trackInfo = document.querySelector("#track-info");
      trackInfo.innerHTML
