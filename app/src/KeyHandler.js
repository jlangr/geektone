import * as Duration from './Duration'

export const isSelectionChangeOnly = e => 
  e.key === 'ArrowLeft' || e.key === 'ArrowRight'

export const handleKey = (e, noteSequence) => {
  if (!noteSequence.isNoteSelected()) return false

  switch (e.key) {
    case 'ArrowUp': noteSequence.incrementSelected(); return true
    case 'ArrowDown': noteSequence.decrementSelected(); return true
    case 'ArrowLeft': 
      if (e.shiftKey)
        noteSequence.selectPrevBar()
      else
        noteSequence.selectPrev()
      return true
    case 'ArrowRight': 
      if (e.shiftKey) 
        noteSequence.selectNextBar() 
      else 
        noteSequence.selectNext()
      return true
    case 'd': noteSequence.duplicateNote(); return true
    case 'x': noteSequence.deleteSelected(); return true
    case '8': noteSequence.setSelectedTo(Duration.eighth); return true
    case '4': noteSequence.setSelectedTo(Duration.quarter); return true
    case '2': noteSequence.setSelectedTo(Duration.half); return true
    case '1': noteSequence.setSelectedTo(Duration.whole); return true
    case '.': noteSequence.toggleDotForSelected(); return true
    case '/': noteSequence.halveSelectedDuration(); return true
    case '*': noteSequence.doubleSelectedDuration(); return true
    case '-': noteSequence.decrementSelectedDuration(); return true
    case '+': noteSequence.incrementSelectedDuration(); return true
    case 'r': noteSequence.toggleRestForSelected(); return true
    case 'y': noteSequence.redo(); return true
    case 'z': noteSequence.undo(); return true

    default: 
      return false
  }
}
