import * as type from '../actions/types'
import NoteSequence from '../NoteSequence'
import { remove } from '../js/ArrayUtil'
import Note from '../Note'
import * as Draw from '../util/Draw'
import * as Constants from '../Constants'
import { isValidCrossOSFilename } from '../util/Validations'
import { nearestNote } from './UIReducer'
const FileSaver = require('file-saver')

const MiddleCNote = new Note(Constants.MiddleC)

export const INITIAL_STATE = {
  message: undefined,
  errorMessage: undefined,
  song: {
    bpm: 120,
    name: 'default',
    tracks: [],
    isDirty: false
  },
  songList: []
}

export const indexOfNoteAfter = (track, x) =>
  track.notes.allNotes().findIndex(n => n.x() > x)

export const defaultTrackVolume = 7

export const isInSharpsMode = (song, id) => song.tracks[id].sharpsMode

export const isInFlatsMode = (song, id) => song.tracks[id].flatsMode

export const isUniqueName = (songList, name, currentName) => 
  name === currentName || !songList.some(song => song.label === name)

export const isValidSongName = (songList, name, currentName) => 
  name === currentName ||
    (isUniqueName(songList, name) && isValidCrossOSFilename(name))

export const trackData = (state, trackId) => state.song.tracks[trackId]

export const hasTrebleNotes = (song, id) =>
  song.tracks[id].notes.allNotes().some(note => 
    note.isHigherOrEqual(MiddleCNote) && !note.isRest())

export const hasBassNotes = (song, id) =>
  song.tracks[id].notes.allNotes().some(note => 
    !note.isHigherOrEqual(MiddleCNote) && !note.isRest())

// TODO test; make part of state?
// barsAndNotes are derived from bars(), 
// which are updated by a rebar() operation
export const barsAndNotes = (song, trackData) => {
  const barsForOtherTracks = song.tracks
    .filter(track => track.name !== trackData.name)
    .map(track => track.notes.bars())

  const stuffToDraw = []

  let barPosition = 0

  trackData.notes.bars()
    .forEach((bar, i) => {
      const crossBars = barsForOtherTracks.map(bars => bars[i]).filter(bar => bar !== undefined)
      const allPositionsRequiredForBar =
        crossBars.map(bar => bar.positionsRequired())
      const positionsRequired = Math.max(...allPositionsRequiredForBar, bar.positionsRequired())
      bar.layouts(positionsRequired).forEach(({ note, position }) => {
        note.setPosition(barPosition + position) // note update!
        stuffToDraw.push(note);
      })
      barPosition += positionsRequired
      bar.position = barPosition++
      bar.topLineY = Draw.topLineY()
      bar.staffHeight = Draw.staffHeight
      stuffToDraw.push(bar)
    })
    return stuffToDraw
}

const updateStateForTrack = (state, trackIndex, changeFn) => {
  const changedTrack = state.song.tracks[trackIndex] 
  if (!changeFn(changedTrack))
    return state

  const newTracks = 
    [...state.song.tracks.slice(0, trackIndex), changedTrack, ...state.song.tracks.slice(trackIndex+1) ]
  return { ...state, song: {...state.song, tracks: newTracks} }
 }

 export const normalizeVolume = rawVolume => {
    let wholeNumber = Math.round(rawVolume)
    if (wholeNumber > 10)
      wholeNumber = Math.floor(wholeNumber / 10)
    return Math.max(wholeNumber, 1)
 }

const updateState_setVolume = (state, trackIndex, rawVolume) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    const newVolume = normalizeVolume(rawVolume)
    if (newVolume === changedTrack.volume) return false
    changedTrack.volume = newVolume
    return true
  })
}

const updateState_toggleClickInsertMode = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.isInClickInsertMode = !changedTrack.isInClickInsertMode
    return true
  })
}

const updateState_toggleMute = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.isMuted = !changedTrack.isMuted
    return true
  })
}

const updateState_toggleFlatsMode = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.flatsMode = !changedTrack.flatsMode
    return true
  })
}

const updateState_toggleSharpsMode = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.sharpsMode = !changedTrack.sharpsMode
    return true
  })
}

const updateState_rebar = (state, trackIndex) =>
  updateStateForTrack(state, trackIndex, _changedTrack => true /* no-op */)

const updateState_addAccidental = (state, note, accidentals, opposingAccidentals) => {
  if (!note) return state

  if (opposingAccidentals.includes(note))
    remove(opposingAccidentals, note)

  if (accidentals.includes(note)) 
    remove(accidentals, note)
  else
    accidentals.push(note)
}

const updateTrack = (state, trackIndex, updatedTrack) => {
  const newTracks = 
    [...state.song.tracks.slice(0, trackIndex), updatedTrack, ...state.song.tracks.slice(trackIndex+1) ]
  return { ...state, song: {...state.song, tracks: newTracks} }
}

const updateState_addFlat = (state, trackIndex, note) => {
  const updatedTrack = state.song.tracks[trackIndex]
  updateState_addAccidental(state, note, updatedTrack.flats, updatedTrack.sharps)
  return updateTrack(state, trackIndex, updatedTrack)
}

const updateState_addSharp = (state, trackIndex, note) => {
  const updatedTrack = state.song.tracks[trackIndex]
  updateState_addAccidental(state, note, updatedTrack.sharps, updatedTrack.flats)
  return updateTrack(state, trackIndex, updatedTrack)
}

const updateState_insertNote = (state, trackIndex, note, index) => {
  const updatedTrack = state.song.tracks[trackIndex]
  updatedTrack.notes.insert(note, index)
  return updateTrack(state, trackIndex, updatedTrack)
}

const convertToSongSelectionList = songs =>
  songs.map(([id, title]) => ({ value: id, label: title }))

export default(state = INITIAL_STATE, action) => {
  state.song.isDirty = true
  state.message = undefined
  state.errorMessage = undefined

  switch (action.type) {
    case type.ADD_FLAT: 
    {
      const { trackIndex, note } = action.payload
      return updateState_addFlat(state, trackIndex, note)
    }

    case type.ADD_SHARP: 
    {
      const { trackIndex, note } = action.payload
      return updateState_addSharp(state, trackIndex, note)
    }

    case type.CHANGE_BPM:
    {
      return { ...state, song: { ...state.song, bpm: action.payload }}
    }

    case type.CHANGE_NEW_SONG_NAME:
    {
      const { newName } = action.payload
      return { ...state, song: { ...state.song, name: newName }}
    }

    case type.CHANGE_SONG_NAME:
    {
      const { newTitle, songList } = action.payload
      return { ...state, 
        songList: convertToSongSelectionList(songList), 
        song: { ...state.song, name: newTitle }}
    }

    case type.CHANGE_TRACK_INSTRUMENT:
    {
      const trackId = action.payload.trackId
      const updatedTrack = state.song.tracks[trackId]
      updatedTrack.instrument = action.payload.instrument

      const tracks = state.song.tracks.map(track => ( track.id === trackId ? updatedTrack: track))

      return { ...state, song: {...state.song, tracks: tracks }}
    }

    case type.CREATE_SONG:
    {
      const { id, songList, message } = action.payload
      return { ...state, 
        message, 
        songList: convertToSongSelectionList(songList), 
        song: { ...state.song, id, isDirty: false }}
    }

    case type.DELETE_TRACK:
    {
      const trackIndexToDelete = action.payload
      state.song.tracks.splice(trackIndexToDelete, 1)
      return { ...state, song: {...state.song, tracks: state.song.tracks }}
    }

    case type.ERROR:
    {
      return { ...state, errorMessage: action.payload }
    }

    // TODO test
    case type.INSERT_NOTE:
    {
      const { trackIndex, clickPoint, uiReducerState } = action.payload
      const track = state.song.tracks[trackIndex]
      const index = indexOfNoteAfter(track, clickPoint.x)
      // Ugh--passing around uiReducerState
      const note = nearestNote(uiReducerState, clickPoint)

      return updateState_insertNote(state, trackIndex, new Note(note), index)
    }

    case type.MARK_CLEAN:
    {
      return { ...state, message: action.payload, song: { ...state.song, isDirty: false } }
    }

    case type.MARK_DIRTY:
    {
      return { ...state, song: { ...state.song, isDirty: true } }
    }

    case type.MESSAGE:
    {
      return { ...state, message: action.payload }
    }

    case type.NEW_SONG:
    {
      return { ...state, song: INITIAL_STATE.song }
    }

    case type.NEW_TRACK:
    {
      const newTrack = { 
        name: `track${state.song.tracks.length + 1}`, 
        isMuted: false,
        instrument: 'piano', 
        notes: new NoteSequence([Constants.DefaultStartingNote]),
        sharps: [],
        flats: [],
        volume: defaultTrackVolume
      }
      return { ...state, song: { ...state.song, tracks: [...state.song.tracks, newTrack] } }
    }

    case type.REMOVE_SONG: 
    {
      return { ...state, song: INITIAL_STATE.song, songList: convertToSongSelectionList(action.payload) }
    }

    case type.REPLACE_SONG:
    {
      const newSong = action.payload
      newSong.tracks = newSong.tracks.map(track => {
        const notes = track.notes.map(note => [note.name, note.duration, note.isNote, note.accidental])
        if (!track.volume) track.volume = defaultTrackVolume
        return { ...track, notes: new NoteSequence(notes) }
      })
      newSong.isDirty = false
      return { ...state, song: newSong }
    }

    case type.SET_VOLUME:
    {
      const { trackIndex, volume } = action.payload
      return updateState_setVolume(state, trackIndex, volume)
    }

    case type.SONG_LIST:
    {
      return { ...state, songList: convertToSongSelectionList(action.payload) }
    }

    case type.TOGGLE_CLICK_INSERT_MODE: 
    {
      const trackIndex = action.payload
      return updateState_toggleClickInsertMode(state, trackIndex)
    }

    case type.TOGGLE_SHARPS_MODE: 
    {
      const trackIndex = action.payload
      return updateState_toggleSharpsMode(state, trackIndex)
    }

    case type.TOGGLE_FLATS_MODE: 
    {
      const trackIndex = action.payload
      return updateState_toggleFlatsMode(state, trackIndex)
    }

    case type.TOGGLE_MUTE:
    {
      const trackIndex = action.payload
      return updateState_toggleMute(state, trackIndex)
    }

    case type.UPDATE_TRACK:
    {
      const trackIndex = action.payload
      return updateState_rebar(state, trackIndex)
    }

    case type.DOWNLOAD_SONG:
    {
      const contents = state.song.tracks.reduce((tracks, track) => {
        tracks.push(`${track.name}\n`)
        const trackNotes = track.notes.notes.map(note => {
          if (note.isNote)
            return `${note.name()}:${note.duration}\n`
          else
            return `rest:${note.duration}\n`
        })
        return tracks.concat(trackNotes)
      }, [])
      const blob = new Blob(contents, {type: "text/plain;charset=utf-8"})
      FileSaver.saveAs(blob, "sample.txt")
    }
    default:
      state.song.isDirty = false
      return state
  }
}
