import * as Duration from './Duration';

export const handleKey = (e, noteSequence) => {
  if (!noteSequence.isNoteSelected()) return false;

  switch (e.key) {
    case 'ArrowUp': noteSequence.incrementSelected(); return true;
    case 'ArrowDown': noteSequence.decrementSelected(); return true;
    case 'ArrowLeft': noteSequence.selectPrev(); return true;
    case 'ArrowRight':noteSequence.selectNext(); return true;
    case 'd': noteSequence.duplicateNote(); return true;
    case 'x': noteSequence.deleteSelected(); return true;
    case '8': noteSequence.setSelectedTo(Duration.eighth); return true;
    case '4': noteSequence.setSelectedTo(Duration.quarter); return true;
    case '2': noteSequence.setSelectedTo(Duration.half); return true;
    case '1': noteSequence.setSelectedTo(Duration.whole); return true;
    case '.': noteSequence.toggleDotForSelected(); return true;
    case '/': noteSequence.halveSelectedDuration(); return true;
    case '*': noteSequence.doubleSelectedDuration(); return true;
    default: return false;
  }
}
