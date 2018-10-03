import Tone from 'tone';
import * as NoteUtil from './NoteUtil';

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