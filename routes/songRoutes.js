const express = require('express');
const router = express.Router();
const Song = require('../models/song');

// Create a song
router.post('/', async (req, res) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a song
router.patch('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove a song
router.delete('/:id', async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/statistics', async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = (await Song.distinct('artist')).length;
    const totalAlbums = (await Song.distinct('album')).length;
    const totalGenres = (await Song.distinct('genre')).length;

    res.json({
      totalSongs,
      totalArtists,
      totalAlbums,
      totalGenres,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/statistics/genres', async (req, res) => {
  try {
    const genreCounts = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $project: { genre: '$_id', count: 1, _id: 0 } },
    ]);

    res.json(genreCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/statistics/artists', async (req, res) => {
  try {
    const artistStats = await Song.aggregate([
      { $group: { _id: '$artist', totalSongs: { $sum: 1 }, totalAlbums: { $addToSet: '$album' } } },
      { $project: { artist: '$_id', totalSongs: 1, totalAlbums: { $size: '$totalAlbums' }, _id: 0 } },
    ]);

    res.json(artistStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/statistics/albumsong', async (req, res) => {
  try {
    const songAlbumStats = await Song.aggregate([
      { $group: { _id: '$album', totalSongs: { $sum: 1 }} },
      { $project: { album: '$_id', totalSongs: 1, _id: 0 } },
    ]);

    res.json(songAlbumStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/genre/:genre', async (req, res) => {
  try {
    const genre = req.params.genre.toLowerCase(); 


    const songsByGenre = await Song.find({ genre });

    res.json(songsByGenre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;