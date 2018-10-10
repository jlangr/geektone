import Tone from 'tone'
import * as NoteUtil from './NoteUtil'
import * as TimeUtil from './TimeUtil'
import * as Duration from './Duration'

let scheduleEventId

/*
  const drawSelect = (note) => {
    if (note.context) {
      const context = note.context
      context.beginPath()
      context.lineWidth = 1
      // this.context.strokeStyle = highlightColor
      // this.context.lineWidth = highlightStroke
      context.moveTo(note.x, note.y - 40)
      context.lineTo(note.x, note.y + 40)
      context.stroke()
    }
  }
  */

const unmutedNoteObjects = tracks => 
  tracks
    .filter(track => !track.isMuted)
    .map(track => [track, NoteUtil.noteObjects(track.notes.allNotes(), track.sharps, track.flats)])

// lots of this can be tested...
export const play = async (song, synths) => {
  const tracks = song.tracks;
  if (Tone.context.state !== 'running')
      Tone.context.resume();

  const noteObjects = unmutedNoteObjects(tracks)

  const stopTimes = noteObjects.map(([_, toneNotes]) => {
    const lastNote = toneNotes[toneNotes.length - 1]
    return TimeUtil.toSixteenths(lastNote.time) + Duration.time(lastNote.duration)
  })
  const stopTime = TimeUtil.transportTime(Math.max(...stopTimes))
  scheduleEventId = Tone.Transport.scheduleOnce(() => console.log('DONE ! ! ! ', ), stopTime)

  const parts = noteObjects.map(([track, toneNotes]) => 
      new Tone.Part((time, note) => {
//        drawSelect(note)
        synths[track.instrument].triggerAttackRelease(note.name, note.duration, time);
      }, toneNotes));

  parts.forEach(part => part.start());

  Tone.Transport.bpm.value = song.bpm;
  const slightDelayToAvoidSchedulingErrors = '+0.1';
  Tone.Transport.start(slightDelayToAvoidSchedulingErrors);
}

export const stop = () => {
  if (scheduleEventId)
    Tone.Transport.clear(scheduleEventId)
  Tone.Transport.stop();
  Tone.Transport.cancel();
};