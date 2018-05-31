import Tone from 'tone';
import * as NoteUtil from './NoteUtil';

export const play = async (song, synths) => {
  const tracks = song.tracks;
  if (Tone.context.state !== 'running')
      Tone.context.resume();

  const parts = tracks.map(track => {
    const toneNotes = NoteUtil.noteObjects(track.notes.allNotes());
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