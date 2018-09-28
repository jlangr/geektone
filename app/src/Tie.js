import Note from './Note'
import TieWidget from './ui/TieWidget';

export default class Tie extends Note {
  // only applies to the Note being manipulated
  isRepresentedAsTie() {
    return false
  }
  drawOn(context) {
    new TieWidget(context, this).draw()
  }
}