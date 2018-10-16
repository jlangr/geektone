import * as type from '../actions/types'
import NoteSequence from '../NoteSequence'
import { remove } from '../js/ArrayUtil'
import * as Draw from '../util/Draw'
import Note from '../Note';

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

export const isInSharpsMode = (song, id) => song.tracks[id].sharpsMode

export const isInFlatsMode = (song, id) => song.tracks[id].flatsMode

export const trackData = (state, trackId) => state.song.tracks[trackId]

const C4 = new Note('C4')

export const hasTrebleNotes = (song, id) =>
  song.tracks[id].notes.allNotes().some(note => note.isHigherOrEqual(C4))

export const hasBassNotes = (song, id) =>
  song.tracks[id].notes.allNotes().some(note => !note.isHigherOrEqual(C4))

// TODO test
// barsAndNotes are derived from bars(), 
// which are updated by a rebar() operation

// TODO make part of state?

export const barsAndNotes = (song, trackData) => {
  const barsForOtherTracks = song.tracks
    .filter(track => track.name !== trackData.name)
    .map(track => track.notes.bars())

  const stuffToDraw = []

  let barPosition = 0
  // TODO this gets updated!
  trackData.notes.bars()
    .forEach((bar, i) => {
      const crossBars = barsForOtherTracks.map(bars => bars[i]).filter(bar => bar !== undefined)
      const allPositionsRequiredForBar =
        crossBars.map(bar => bar.positionsRequired())
      const positionsRequired = Math.max(...allPositionsRequiredForBar, bar.positionsRequired())
      bar.layouts(positionsRequired).forEach(({ note, position }) => {
        note.setPosition(barPosition + position)
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

// state

const updateStateForTrack = (state, trackIndex, changeFn) => {
  const changedTrack = state.song.tracks[trackIndex] 
  changeFn(changedTrack)
  const newTracks = 
    [...state.song.tracks.slice(0, trackIndex), changedTrack, ...state.song.tracks.slice(trackIndex+1) ]
  return { ...state, song: {...state.song, tracks: newTracks} }
 }

const updateState_toggleMute = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.isMuted = !changedTrack.isMuted
  })
}

const updateState_toggleFlatsMode = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.flatsMode = !changedTrack.flatsMode
  })
}

const updateState_toggleSharpsMode = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.sharpsMode = !changedTrack.sharpsMode
  })
}

const updateState_rebar = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, _changedTrack => {
    //  no-op
  })
}

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
  updatedTrack.flatsMode = false
  updateState_addAccidental(state, note, updatedTrack.flats, updatedTrack.sharps)
  return updateTrack(state, trackIndex, updatedTrack)
}

const updateState_addSharp = (state, trackIndex, note) => {
  const updatedTrack = state.song.tracks[trackIndex]
  updatedTrack.sharpsMode = false
  updateState_addAccidental(state, note, updatedTrack.sharps, updatedTrack.flats)
  return updateTrack(state, trackIndex, updatedTrack)
}

const convertToSongSelectionList = songs =>
  songs.map(([id, title]) => ({ value: id, label: title }))

export default(state = INITIAL_STATE, action) => {
//  const incomingStateIsDirty = state.song.isDirty
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
      const { id, message } = action.payload
      return { ...state, message, song: { ...state.song, id }}
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

    case type.MARK_CLEAN:
    {
      return { ...state, message: action.payload, song: { ...state.song, isDirty: false } }
    }

    case type.MESSAGE:
    {
      return { ...state, message: action.payload }
    }

    case type.NEW_TRACK:
    {
      const newTrack = { 
        name: `track${state.song.tracks.length + 1}`, 
        isMuted: false,
        instrument: 'piano', 
        notes: new NoteSequence(['E4']),
        sharps: [],
        flats: []
      }
      return { ...state, song: { ...state.song, tracks: [...state.song.tracks, newTrack] } }
    }

    case type.REPLACE_SONG:
    {
      const newSong = action.payload
      newSong.tracks = newSong.tracks.map(track => {
        const notes = track.notes.map(note => [note.name, note.duration, note.isNote])
        return { ...track, notes: new NoteSequence(notes) }
      })
      return { ...state, song: newSong }
    }

    case type.SONG_LIST:
    {
      return { ...state, songList: convertToSongSelectionList(action.payload) }
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

    default:
//      return { ...state, song: { ...state.song, isDirty: false } }
      state.song.isDirty = false
      return state // should not trigger a state change
  }
}