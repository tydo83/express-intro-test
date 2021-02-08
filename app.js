var express = require("express");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let artistArray = [
  {
    id: 1,
    name: "Kanye",
    albumsArray: [
      {
        id: 1,
        name: "The coding dropout",
      },
    ],
    topSongs: [
      {
        id: 1,
        name: "The Javascript State of Mind",
      },
    ],
  },
  {
    id: 2,
    name: "Chris Brown",
    albumsArray: [
      {
        id: 1,
        name: "The Greatest Algorithm",
      },
    ],
    topSongs: [
      {
        id: 1,
        name: "Wheel on the bus",
      },
    ],
  },
];

// 1. Get all artists
app.get("/", function (req, res) {
  res.status(200).json({
    artistArray
  })
})

// 2. Get all artists without albumsArray and topSongs
app.get("/artists", function (req, res) {
  let result = [];
  artistArray.forEach((artist) => {
    result.push({
      id: artist.id,
      name: artist.name
    });
  })

  res.status(200).json({
    artists: result
  })
})

// 3. Get artist by ID
app.get("/artists/:artistID", function (req, res) {
  let result = "Sorry, the artist you are looking for does not exist"
  let artistID = Number(req.params.artistID);

  artistArray.forEach((artist) => {
    if (artist.id === artistID) {
      result = artist.name
    }
  });
  res.status(200).json({
    result
  });
});

// 4. Get artist's album by ID
app.get("/artists/:artistID/:albumID", function (req, res) {
  let result = "Sorry, the album you are looking for does not exist"
  let artistID = Number(req.params.artistID);
  let albumID = Number(req.params.albumID);

  artistArray.forEach((artist) => {
    if (artist.id === artistID) {
      artist.albumsArray.forEach((album) => {
        if (album.id === albumID) {
          result = album.name;
        } 
      })
    }
  });
  res.status(200).json({
    result,
  });
});

// 5. Get artist's topSongs by ID
app.get("/artists/:artistID/:albumID/:songID", function (req, res) {
  let result = "Sorry, the song you are looking for does not exist"
  let artistID = Number(req.params.artistID);
  let songID = Number(req.params.songID);
  
  artistArray.forEach((artist) => {
    if (artist.id === artistID) {
      artist.topSongs.forEach((song) => {
        if (song.id === songID) {
          result = song.name;
        }
      })
    }
  });
  res.status(200).json({
    result,
  });
});

app.post("/add-artist/:artistID", function (req, res) {
  let artistID = Number(req.params.artistID);
  let duplicateChecker = false;

  artistArray.forEach((artist) => {
    if(artist.id === artistID) {
      res.send("Sorry, that artist already exist")
      duplicateChecker = true;
    } 
  })
  
  if(!duplicateChecker) {
    artistArray.push(req.body);
  }

  res.status(200).json({
    artistArray
  })
})

app.post("/add-new-album/:artistID/:albumID", function(req, res) {
  let artistID = Number(req.params.artistID);
  let albumID = Number(req.params.albumID);
  let artistDuplicateChecker = false;
  
  artistArray.forEach((artist) => {
    if(artistID === artist.id) {
      artistDuplicateChecker = true;
      artist.albumsArray.forEach((album) => {
        if(album.id === albumID) {
          res.send("Sorry that album is already exist")
          duplicateChecker = true;
        } else {
          artist.albumsArray.push(req.body)
        }
      })
    }
  })
  
  if (!artistDuplicateChecker) {
    res.send("Sorry, that artist doesn't exist")
  }

  res.status(200).json({
    artistArray
  })
})

app.post("/add-new-top-songs/:artistID/:topSongID", function(req, res){
  let artistID = Number(req.params.artistID);  
  let topSongID = Number(req.params.topSongID);
  let artistDuplicateChecker = false;

  artistArray.forEach((artist) => {
    if(artistID === artist.id) {
      artistDuplicateChecker = true;
      artist.topSongs.forEach((song) => {
        if(song.id === topSongID) {
          res.send("Sorry that song is already exist")
        } else {
          artist.topSongs.push(req.body)
        }
      })
    }
  })
  
  if (!artistDuplicateChecker) {
    res.send("Sorry, that artist doesn't exist")
  }

  res.status(200).json({
    artistArray
  })
})

app.put("/edit-artist/:artistID", function (req, res) {
  let artistID = Number(req.params.artistID);
  let artistIndex;
  let obj = {};
  let checker = false;

  artistArray.forEach((artist, index) => {
    if (artist.id === artistID) {
      obj = { ...artist, ...req.body }
      artistIndex = index;
      checker = true;
    }
  })

  if(checker === false) {
    res.send("Sorry, the artist you are trying to update does not exist")
  } else {
    artistArray[artistIndex] = obj;
    res.status(200).json({
      artistArray
    })
  }
})

app.delete("/delete-artist/:artistID", function (req, res) {
  let artistID = Number(req.params.artistID);
  let artistIndex;

  artistArray.forEach((artist, index) => {
    if (artist.id === artistID) {
      artistIndex = index;
    }
  });

  let filteredArtistArray = artistArray.filter((artist) => {
    return artist.id  !== req.body.id
  })

  artistArray[artistIndex] = filteredArtistArray;

  res.status(200).json(artistArray);
})

app.listen(3000, () => {
  console.log("STARTED");
});
