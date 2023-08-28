const {Pool} = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsFromPlaylistById(playlistId) {
    const queryGetPlaylist = {
      text: `SELECT p.id, p.name, u.username FROM playlist AS p INNER JOIN users AS u ON p.owner = u.id WHERE p.id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(queryGetPlaylist);
    const queryGetSongs = {
      text: `SELECT s.id, s.title, s.performer FROM songs AS s INNER JOIN playlist_songs AS p ON p.song_id = s.id WHERE p.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(queryGetSongs);

    const playlists = playlistResult.rows[0];

    const result = {
      playlist: {
        id: playlists.id,
        name: playlists.name,
        songs: songsResult.rows,
      },
    };

    return result;
  }
}

module.exports = PlaylistService;
