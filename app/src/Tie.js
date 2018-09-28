import Note from './Note'
import TieWidget from './ui/TieWidget';

export default class Tie extends Note {
  drawOn(context) {
    new TieWidget(context, this).draw()
  }
}