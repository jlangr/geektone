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

export const deleteTrack = trackIndex => ({ type: type.DELETE_TRACK, payload: trackIndex })

export const markClean = message => ({ type: type.MARK_CLEAN, payload: message })

export const newTrack = () => ({ type: type.NEW_TRACK })

export const replaceSong = song => ({ type: type.REPLACE_SONG, payload: song })

export const toggleSharpsMode = trackIndex => ({ type: type.TOGGLE_SHARPS_MODE, payload: trackIndex })

export const toggleFlatsMode = trackIndex => ({ type: type.TOGGLE_FLATS_MODE, payload: trackIndex })

export const toggleMute = trackIndex => ({ type: type.TOGGLE_MUTE, payload: trackIndex })

const errorMessage = message => ({ type: type.ERROR, payload: message })

export const createSong = song => 
  dispatch => 
    axios.post(request('/song'), song)
      .then(response => dispatch({ type: type.CREATE_SONG, payload: { id: response.data, message: 'song saved' }}))
      .catch(error => dispatch(errorMessage(`unable to create your song, sorry: ${error.toString()}`)))

export const loadSong = () =>
  dispatch =>
    axios.get(request('/song'))
      .then(response => dispatch(replaceSong(response.data)))
      .catch(error => dispatch(errorMessage(`unable to load song; ${error.toString()}`)))

export const updateSong = song =>
  dispatch =>
    axios.put(request(`/song/${song.id}`), song)
      .then(_response => dispatch({ type: type.MARK_CLEAN, payload: 'song saved' }))
      .catch(error => dispatch(errorMessage(`unable to save your song, sorry: ${error.toString()}`)))

export const saveSong = song => song.id ? updateSong(song) : createSong(song)