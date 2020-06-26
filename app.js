require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebAPI = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req,res)=> {
    res.render('home')
})

app.get('/artist-search', (req,res) => {
    // console.log(req.query.artist);
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
    //  console.log('The received data from the API: ', {artists : data.body.artists.items});
      res.render('artist-search-results.hbs', {artists : data.body.artists.items} )


    })
    .catch(err => console.log('The error while searching artists occurred: ', err));    
});

app.get('/albums/:artistID', (req,res)=> {
    spotifyApi.getArtistAlbums(req.params.artistID).then ( data =>{
        res.render('albums.hbs', {albums : data.body.items})
    }).catch(err => console.log('The error while searching albums occurred: ', err));
    
})

app.get('/tracks/:albumID', (req, res) => {
    console.log(req.params.albumID)
    spotifyApi.getAlbumTracks(req.params.albumID).then(data => {
        res.render('tracks.hbs', {tracks: data.body.items})
        console.log('The list of tracks:',data.body.items)
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
