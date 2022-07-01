const express = require("express");
require("mongoose");
require("./mongooseConnectivity");
const Song = require("./songSchema");
const multer = require("multer");

const app = express();
const port = process.env.PORT;

app.use(express.json());

const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith(".mp3")) {
      return cb(new Error("File must be mp3"));
    }
    cb(undefined, true);
  },
});

app.post(
  "/addSong",
  upload.single("song"),
  async (req, res) => {
    //   res.send();
    try {
      const song = new Song({
        name: req.body.name,
        category: req.body.category,
        artist: req.body.artist,
        genre: req.body.genre,
        mp3file: req.file.buffer,
      });
      const sendSong = await song.save();
      res.send(sendSong);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  },
  (error, req, res, next) => {
    res.status(404).send({ error: error.message });
  }
);

app.get("/getSong/:id", async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id });
    res.set("Content-Type", "audio/mpeg");
    res.send(song.mp3file);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.get("/getSongs", async (req, res) => {
  try {
    pageNumber = parseInt(req.query.pageNumber);
    pageSize = parseInt(req.query.pageSize);
    const songs = await Song.find()
      .limit(pageSize)
      .skip(pageSize * pageNumber);
    res.send(songs);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.get("/getSongBySorting", async (req, res) => {
  try {
    const sort = {};
    if (req.query.category) {
      sort.category = req.query.category;
    }
    if (req.query.genre) {
      sort.genre = req.query.genre;
    }
    const songs = await Song.find(sort);
    res.send(songs);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("app started");
});
