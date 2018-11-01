import Note from './Note'
import TieWidget from './ui/TieWidget'

export default class Tie extends Note {
  constructor(noteName, duration, isNote=true, accidental='', isSelected=false, index=0) {
    super(noteName, duration, isNote, accidental)
    this.isSelected = isSelected
    this.tieIndex = index
    console.log('<ctor> of Tie ', this.tieIndex)
  }

  // only applies to the Note being manipulated
  isRepresentedAsTie() {
    return false
  }

  drawOn(context) {
    new TieWidget(context, this).draw()
  }
}