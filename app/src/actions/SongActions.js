import * as type from './types'
import axios from 'axios'

export const server = 'http://localhost:3001'
export const request = path => `${server}${path}`

export const addFlat = (trackIndex, note) => ({ type: type.ADD_FLAT, payload: { trackIndex, note }})

export const addSharp = (trackIndex, note) => ({ type: type.ADD_SHARP, payload: { trackIndex, note }})

export const updateTrack = trackIndex => ({ type: type.UPDATE_TRACK, payload: trackIndex })

export const changeBpm = newBpm => ({ type: type.CHANGE_BPM, payload: newBpm })

export const changeSongName = newName => ({ type: type.CHANGE_SONG_NAME, payload: newName })

export const changeTrackInstrument = (instrument, id) => {
  return { type: type.CHANGE_TRACK_INSTRUMENT, payload: {instrument: instrument, trackId: id }}
}

export const deleteTrack = trackIndex => ({ type: type.DELETE_TRACK, payload: trackIndex })

export const loadSong = () => {
  return dispatch => {
    return axios.get(request('/song'))
      .then(response => {
        dispatch(replaceSong(response.data))
      })
      .catch(error => { 
        dispatch({ type: type.ERROR, payload: `unable to load song; ${error.toString()}` })
      })
  }
}

export const newTrack = () => ({ type: type.NEW_TRACK })

export const replaceSong = song => ({ type: type.REPLACE_SONG, payload: song })

export const saveSong = (song) => {
  return dispatch => {
    return axios.post(request('/song'), song)
      .then(_response => { 
        dispatch({ type: type.MESSAGE, payload: 'song saved'})
      })
      .catch(error => { 
        dispatch({ type: type.ERROR, payload: `unable to save your song, sorry: ${error.toString()}` })
    })
  }
}

export const toggleSharpsMode = trackIndex => ({ type: type.TOGGLE_SHARPS_MODE, payload: trackIndex })

export const toggleFlatsMode = trackIndex => ({ type: type.TOGGLE_FLATS_MODE, payload: trackIndex })

export const toggleMute = trackIndex => ({ type: type.TOGGLE_MUTE, payload: trackIndex })