import { whole, half, quarter, eighth, sixteenth } from './TimeUtil';

export const handleKey = (e, noteSequence) => {
  if (!noteSequence.isNoteSelected()) return false;
  switch (e.key) {
    // TODO change to incrementSelected / decrementSelected
    case 'ArrowUp':    noteSequence.selectedNote().increment(); return true;
    case 'ArrowDown':  noteSequence.selectedNote().decrement(); return true;
    case 'ArrowLeft':  noteSequence.selectPrev(); return true;
    case 'ArrowRight': noteSequence.selectNext(); return true;
    case 'd': noteSequence.duplicateNote(); return true;
    case 'x': noteSequence.deleteSelected(); return true;
    case '8': noteSequence.setSelectedTo(eighth); return true;
    case '4': noteSequence.setSelectedTo(quarter); return true;
    case '2': noteSequence.setSelectedTo(half); return true;
    case '1': noteSequence.setSelectedTo(whole); return true;
    case '.': noteSequence.toggleDotForSelected(); return true;
    case '/': noteSequence.halveSelectedDuration(); return true;
    case '*': noteSequence.doubleSelectedDuration(); return true;
    default: return false;
  }
}
