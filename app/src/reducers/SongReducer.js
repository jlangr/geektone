import * as type from '../actions/types'
import NoteSequence from '../NoteSequence'
import { remove } from '../js/ArrayUtil'
import * as Draw from '../util/Draw'

export const INITIAL_STATE = {
  song: {
    name: 'default',
    tracks: []
  }
}

// query functions

export const isInSharpsMode = (song, id) => song.tracks[id].sharpsMode

export const trackData = (state, trackId) => state.song.tracks[trackId]

// TODO test
// barsAndNotes are derived from bars(), 
// which are updated by a rebar() operation
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

const updateState_toggleSharpsMode = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, (changedTrack) => {
    changedTrack.sharpsMode = !changedTrack.sharpsMode
  })
}

const updateState_rebar = (state, trackIndex) => {
  return updateStateForTrack(state, trackIndex, _changedTrack => {
    //  NOOP
  })
}

const updateState_addSharp = (state, trackIndex, note) => {
  if (!note) return state

  const updatedTrack = state.song.tracks[trackIndex]
  if (!updatedTrack.sharps) updatedTrack.sharps = []

  if (updatedTrack.sharps.includes(note)) 
    remove(updatedTrack.sharps, note)
  else
    updatedTrack.sharps.push(note)

  updatedTrack.sharpsMode = false

  const newTracks = 
    [...state.song.tracks.slice(0, trackIndex), updatedTrack, ...state.song.tracks.slice(trackIndex+1) ]

  return { ...state, song: {...state.song, tracks: newTracks} }
}

// refactor track update
export default(state = INITIAL_STATE, action) => {
  switch (action.type) {
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
      return { ...state, song: { ...state.song, name: action.payload }}
    }

    case type.CHANGE_TRACK_INSTRUMENT:
    {
      const trackId = action.payload.trackId
      const updatedTrack = state.song.tracks[trackId]
      updatedTrack.instrument = action.payload.instrument

      const tracks = state.song.tracks.map(track => ( track.id === trackId ? updatedTrack: track))

      return { ...state, song: {...state.song, tracks: tracks }}
    }

    case type.DELETE_TRACK:
    {
      const trackIndexToDelete = action.payload
      state.song.tracks.splice(trackIndexToDelete, 1)
      return { ...state, song: {...state.song, tracks: state.song.tracks }}
    }

    case type.NEW_TRACK:
    {
      const newTrack = { name: `track${state.song.tracks.length + 1}`, notes: new NoteSequence(['E4']) }
      return { ...state, song: { ...state.song, tracks: [...state.song.tracks, newTrack] } }
    }

    case type.REPLACE_SONG:
    {
      const newSong = action.payload
      newSong.tracks = newSong.tracks.map(track => {
        const notes = track.notes.map(note => [note.name, note.duration])
        return { ...track, notes: new NoteSequence(notes) }
      })
      return { ...state, song: newSong }
    }

    case type.TOGGLE_SHARPS_MODE: 
    {
      const trackIndex = action.payload
      return updateState_toggleSharpsMode(state, trackIndex)
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
      return state
  }
}