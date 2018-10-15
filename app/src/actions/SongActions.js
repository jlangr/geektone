import * as type from './types'
import axios from 'axios'

export const server = 'http://localhost:3001'
export const request = path => `${server}${path}`

export const addFlat = (trackIndex, note) => ({ type: type.ADD_FLAT, payload: { trackIndex, note }})

export const addSharp = (trackIndex, note) => ({ type: type.ADD_SHARP, payload: { trackIndex, note }})

export const updateTrack = trackIndex => ({ type: type.UPDATE_TRACK, payload: trackIndex })

export const changeBpm = newBpm => ({ type: type.CHANGE_BPM, payload: newBpm })

export const changeSongName = newName => ({ type: type.CHANGE_SONG_NAME, payload: newName })

export const changeTrackInstrument = (instrument, id) => ({ type: type.CHANGE_TRACK_INSTRUMENT, payload: {instrument: instrument, trackId: id }})

export const createSong = (id, message) => ({ type: type.CREATE_SONG, payload: { id, message } })

export const deleteTrack = trackIndex => ({ type: type.DELETE_TRACK, payload: trackIndex })

// TODO test
export const loadSongList = () =>{
  return dispatch =>
    axios.get(request(`/songs`))
      .then(response => dispatch({ type: type.SONG_LIST, payload: response.data }))
      .catch(error => dispatch(errorMessage(`unable to retrieve song list: ${error.toString}`)))
}

export const markClean = message => ({ type: type.MARK_CLEAN, payload: message })

export const newTrack = () => ({ type: type.NEW_TRACK })

export const replaceSong = song => ({ type: type.REPLACE_SONG, payload: song })

export const toggleSharpsMode = trackIndex => ({ type: type.TOGGLE_SHARPS_MODE, payload: trackIndex })

export const toggleFlatsMode = trackIndex => ({ type: type.TOGGLE_FLATS_MODE, payload: trackIndex })

export const toggleMute = trackIndex => ({ type: type.TOGGLE_MUTE, payload: trackIndex })

const errorMessage = message => ({ type: type.ERROR, payload: message })

export const postSong = song => 
  dispatch => 
    axios.post(request('/song'), song)
      .then(response => dispatch(createSong(response.data.toString(), 'song created')))
      .catch(error => dispatch(errorMessage(`unable to create your song, sorry: ${error.toString()}`)))

export const loadSong = id =>
  dispatch =>
    axios.get(request(`/song/${id}`))
      .then(response => dispatch(replaceSong(response.data)))
      .catch(error => dispatch(errorMessage(`unable to load song; ${error.toString()}`)))

export const putSong = song =>
  dispatch =>
    axios.put(request(`/song/${song.id}`), song)
      .then(_response => dispatch(markClean('song saved')))
      .catch(error => dispatch(errorMessage(`unable to save your song, sorry: ${error.toString()}`)))

export const saveSong = song => song.id ? putSong(song) : postSong(song)