import * as type from './types'
import axios from 'axios'

export const server = 'http://localhost:3001'
export const request = path => `${server}${path}`

export const addFlat = (trackIndex, note) => ({ type: type.ADD_FLAT, payload: { trackIndex, note }})

export const addSharp = (trackIndex, note) => ({ type: type.ADD_SHARP, payload: { trackIndex, note }})

export const updateTrack = trackIndex => ({ type: type.UPDATE_TRACK, payload: trackIndex })

export const changeBpm = newBpm => ({ type: type.CHANGE_BPM, payload: newBpm })

export const changeNewSongName = newName => ({ type: type.CHANGE_NEW_SONG_NAME, payload: { newName }})

export const changeSongName = (newTitle, songList) => ({ type: type.CHANGE_SONG_NAME, payload: { newTitle, songList }})

export const changeTrackInstrument = (instrument, id) => ({ type: type.CHANGE_TRACK_INSTRUMENT, payload: {instrument: instrument, trackId: id }})

export const createSong = (id, songList, message) => ({ type: type.CREATE_SONG, payload: { id, message, songList } })

export const deleteTrack = trackIndex => ({ type: type.DELETE_TRACK, payload: trackIndex })

export const downloadSong = () => ({ type: type.DOWNLOAD_SONG })

export const errorMessage = message => ({ type: type.ERROR, payload: message })

export const insertNote = (trackIndex, clickPoint, uiReducerState) => ({ type: type.INSERT_NOTE, payload: { trackIndex, clickPoint, uiReducerState }})

export const markClean = message => ({ type: type.MARK_CLEAN, payload: message })

export const markDirty = () => ({ type: type.MARK_DIRTY })

export const newSong = () => ({ type: type.NEW_SONG })

export const newTrack = () => ({ type: type.NEW_TRACK })

export const removeSong = songList => ({ type: type.REMOVE_SONG, payload: songList })

export const replaceSong = song => ({ type: type.REPLACE_SONG, payload: song })

export const setVolume = (trackIndex, volume) => ({ type: type.SET_VOLUME, payload: { trackIndex, volume }})

export const songList = songs => ({ type: type.SONG_LIST, payload: songs })

export const toggleClickInsertMode = trackIndex => ({ type: type.TOGGLE_CLICK_INSERT_MODE, payload: trackIndex })

export const toggleFlatsMode = trackIndex => ({ type: type.TOGGLE_FLATS_MODE, payload: trackIndex })

export const toggleMute = trackIndex => ({ type: type.TOGGLE_MUTE, payload: trackIndex })

export const toggleSharpsMode = trackIndex => ({ type: type.TOGGLE_SHARPS_MODE, payload: trackIndex })

export const deleteSong = song =>
  dispatch => {
    if (song.id === undefined)
      return dispatch(newSong())
    return axios.delete(request(`/song/${song.id}`))
      .then(response => dispatch(removeSong(response.data)))
      .catch(error => dispatch(errorMessage(`unable to delete song: ${error.toString()}`)))
  }

export const loadSongList = () =>
  dispatch =>
    axios.get(request('/songs'))
      .then(response => dispatch(songList(response.data)))
      .catch(error => dispatch(errorMessage(`unable to retrieve song list: ${error.toString()}`)))

export const postSong = song =>
  dispatch => 
    axios.post(request('/song'), song)
      .then(response => dispatch(createSong(response.data.id, response.data.songList, 'song created')))
      .catch(error => dispatch(errorMessage(`unable to create your song, sorry: ${error.toString()}`)))

export const putSongName = (id, newName) =>
  dispatch => {
    if (id === undefined)
      return dispatch(changeNewSongName(newName.trim()))
    return axios.put(request(`/song/${id}/rename`), { newTitle: newName.trim() })
      .then(response => {
        dispatch(changeSongName(newName.trim(), response.data))})
      .catch(error => dispatch(errorMessage(`unable to rename song: ${error.toString()}`)))
  }

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

export const saveSong = song => {
  return song.id ? putSong(song) : postSong(song)
}