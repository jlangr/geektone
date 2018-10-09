import Tone from 'tone';
import * as NoteUtil from './NoteUtil';

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

// lots of this can be tested...
export const play = async (song, synths) => {
  const tracks = song.tracks;
  if (Tone.context.state !== 'running')
      Tone.context.resume();

  const parts = tracks
    .filter(track => !track.isMuted)
    .map(track => {
      const toneNotes = NoteUtil.noteObjects(track.notes.allNotes(), track.sharps, track.flats);
      return new Tone.Part((time, note) => {
//        drawSelect(note)
        synths[track.instrument].triggerAttackRelease(note.name, note.duration, time);
      }, toneNotes);
    });

  parts.forEach(part => part.start());

  Tone.Transport.bpm.value = song.bpm;
  const slightDelayToAvoidSchedulingErrors = '+0.1';
  Tone.Transport.start(slightDelayToAvoidSchedulingErrors);
}

export const stop = () => {
  Tone.Transport.stop();
  Tone.Transport.cancel();
};