import NoteSequence from './NoteSequence'
import * as Duration from './Duration'
import Note from './Note'
import Tie from './Tie'

describe('NoteSequence', () => {
  let sequence

  describe('empty sequence', () => {
    describe('toJSON', () => {
      it('converts a notesequence to persistable JSON', () => {
        sequence = new NoteSequence([['E4', '4n'], ['F4', '8n'], ['G4', '16n']])

        expect(sequence.toJSON()).toEqual([
          { name: 'E4', duration: '4n', isNote: true },
          { name: 'F4', duration: '8n', isNote: true },
          { name: 'G4', duration: '16n', isNote: true }
        ])
      })
    })

    describe('construction', () => {
      it('can be constructed with multiple notes', () => {
        sequence = new NoteSequence(['E4', 'F4'])

        expect(sequence.allNoteNames()).toEqual(['E4', 'F4'])
      })

      it('can be constructed with multiple notes', () => {
        sequence = new NoteSequence([['E4', '4n'], ['F4', '8n']])

        expect(sequence.note(0).duration).toEqual('4n')
        expect(sequence.note(1).duration).toEqual('8n')
      })

      it('restores rest boolean', () => {
        sequence = new NoteSequence([['E4', '4n', false]])

        expect(sequence.note(0).isNote).toBeFalsy()
      })
    })
  })

  describe('undo / redo', () => {
    let sequence

    beforeEach(() => {
      sequence = new NoteSequence([['E4', Duration.quarter], ['F4', Duration.quarter]])
    })

    it('supports multiple undo', () => {
      sequence.selectFirst()
      sequence.toggleDotForSelected()
      sequence.selectFirst()
      sequence.duplicateNote()

      sequence.undo()
      sequence.undo()

      expect(sequence.allNoteNames()).toEqual(['E4', 'F4'])
    })

    it('supports redo', () => {
      sequence.selectFirst()
      sequence.toggleDotForSelected()
      sequence.selectFirst()
      sequence.duplicateNote()
      sequence.undo()
      sequence.undo()

      sequence.redo()
      sequence.redo()
      
      expect(sequence.allNotesWithDurations()).toEqual(
        [['E4', Duration.dottedQuarter], ['E4', Duration.dottedQuarter], ['F4', Duration.quarter]])
    })
  })

  describe('bar sequence after rebar for non-standard note durations', () => {
    it('creates a tie for non-standard note durations', () => {
      const sequence = new NoteSequence()
      sequence.add(new Note('C4', '0:1:3'))

      const bars = sequence.bars()

      const firstBarNotes = bars[0].notes
      expect(firstBarNotes[0].duration).toEqual('0:1:2')
      expect(firstBarNotes[1].duration).toEqual('0:0:1')
    })
  })

  describe('bar sequence after rebar', () => {
    const e = new Note('E4', Duration.quarter)
    const f4Half = new Note('F4', Duration.half)
    let sequence

    beforeEach(() => {
      sequence = new NoteSequence()
    })

    it('creates a tie for notes that do not fit', () => {
      sequence.addAll(e, e, e, f4Half)

      const bars = sequence.bars()

      const firstBarNotes = bars[0].notes
      const lastNoteOfFirstBar = firstBarNotes[firstBarNotes.length - 1]
      expect(lastNoteOfFirstBar.name()).toEqual('F4')
    })

    it('fills a bar with four beats', () => {
      sequence.addAll(e, e, e, e)

      const bars = sequence.bars()

      expect(bars.length).toEqual(1)
      expect(bars[0].notes).toEqual([e, e, e, e])
    })

    it('puts a bar inbetween every 4 beats', () => {
      sequence.addAll(e, e, e, e, e, e, e, e, e)

      const bars = sequence.bars()

      expect(bars.length).toEqual(3)
      expect(bars[0].notes).toEqual([e, e, e, e])
      expect(bars[1].notes).toEqual([e, e, e, e])
      expect(bars[2].notes).toEqual([e])
    })

    it('tracks the start index for each bar', () => {
      sequence.addAll(e, e, e, e, e, e, e, e, e)

      const bars = sequence.bars()

      expect(bars[0].startIndex).toEqual(0)
      expect(bars[1].startIndex).toEqual(4)
      expect(bars[2].startIndex).toEqual(8)
    })

    it('handles all notes', () => {
      const fHalf = new Note('F4', Duration.half)
      sequence.addAll(e, e, fHalf, e)

      const bars = sequence.bars()

      expect(bars.length).toEqual(2)
      expect(bars[0].notes).toEqual([e, e, fHalf])
      expect(bars[1].notes).toEqual([e])
    })

    it('puts all tie notes in place', () => {
      const a = new Note('F4', Duration.dottedHalf)
      const b = new Note('G4', Duration.half)
      sequence.addAll(a, b);

      const bars = sequence.bars() 

      const bar0Notes = bars[0].notes
      expect(bar0Notes[0].toJSON()).toEqual(new Note('F4', Duration.dottedHalf).toJSON())
      expect(bar0Notes[1].toJSON()).toEqual(new Tie('G4', Duration.quarter).toJSON())
    })

    it('handles tie split into multiple notes', () => {
      const dottedQuarter = new Note('F4', Duration.dottedQuarter)
      const whole = new Note('F4', Duration.whole)
      sequence.addAll(dottedQuarter, whole);

      const bars = sequence.bars()

      expect(bars.length).toEqual(2)
      const bar0Sixteenths = bars[0].notes.map(note => note.sixteenths())
      expect(bar0Sixteenths).toEqual([6, 8, 2])
      const bar1Sixteenths = bars[1].notes.map(note => note.sixteenths())
      expect(bar1Sixteenths).toEqual([6])
    })

    it('splites into tie for clean new note of next sequence', () => {
      sequence.addAll(
        new Note('D3', '0:2:0'),
        new Note('E3', '0:1:1'), 
        new Note('F3', '0:0:3'), 
        new Note('G3', '0:2:2'))

        const bars = sequence.bars()

        console.log(bars[1].notes)
        expect(bars[1].notes[0]).toEqual(new Tie('G3', Duration.half, false))
        expect(bars[1].notes[1].toJSON()).toEqual(new Tie('G3', Duration.eighth, false).toJSON())
    })

    describe('create ties for too-long note', () => {
      let sequence
      const halfE4 = new Note('E4', Duration.half)
      const quarterE4 = new Note('E4', Duration.quarter)

      beforeEach(() => {
        sequence = new NoteSequence()
      })

      it('splits a half', () => {
        const sixteenthsAvailable = 4

        const [startTies, endTies] = sequence.createTies(halfE4, sixteenthsAvailable)

        expect(startTies).toEqual([new Tie('E4', Duration.quarter, halfE4.isSelected)])
        expect(endTies.map(t => t.toJSON())).toEqual([new Tie('E4', Duration.quarter, halfE4.isSelected).toJSON()])
      })

      it('splits to timeremaining plus new note', () => {
        const sixteenthsAvailable = 2

        const [startTies, endTies] = sequence.createTies(quarterE4, sixteenthsAvailable)

        expect(startTies).toEqual([new Tie('E4', Duration.eighth, quarterE4.isSelected)])
        expect(endTies.map(t => t.toJSON())).toEqual([new Tie('E4', Duration.eighth, quarterE4.isSelected).toJSON()])
      })

      it('creates ties for dotted notes too', () => {
        const sixteenthsAvailable = 3

        const [startTies, endTies] = sequence.createTies(quarterE4, sixteenthsAvailable)

        expect(startTies).toEqual([new Tie('E4', Duration.dottedEighth, quarterE4.isSelected)])
        expect(endTies.map(t => t.toJSON())).toEqual([new Tie('E4', Duration.sixteenth, quarterE4.isSelected).toJSON()])
      })

      it('stores start tie in end tie', () => {
        const sixteenthsAvailable = 4

        const [startTies, endTies] = sequence.createTies(halfE4, sixteenthsAvailable)

        const lastNote = endTies[endTies.length - 1]
        expect(lastNote.startTie).toEqual(startTies[0])
      })

      it('retains rests in ties', () => {
        const halfRest = Note.Rest(Duration.half)
        const sixteenthsAvailable = 4

        const [startTies, endTies] = sequence.createTies(halfRest, sixteenthsAvailable)

        expect(startTies[0].isRest()).toBeTruthy()
        expect(endTies[0].isRest()).toBeTruthy()
      })
    })
  })
  
  describe('a rebar', () => {
    const e = new Note('E4', Duration.quarter)
    let sequence
    let rebar
    let existingRebar

    beforeEach(() => {
      existingRebar = NoteSequence.prototype.rebar
    })

    afterEach(() => {
      NoteSequence.prototype.rebar = existingRebar
    })

    describe('on construction', () => {
      it('triggers once with any notes', () => {
        rebar = jest.fn()
        NoteSequence.prototype.rebar = rebar
        sequence = new NoteSequence(['E4', 'E5'])
        expect(rebar).toHaveBeenCalledTimes(1)
      })

      it('does not trigger if no notes added', () => {
        rebar = jest.fn()
        NoteSequence.prototype.rebar = rebar
        sequence = new NoteSequence([])
        expect(rebar).not.toHaveBeenCalled()
      })
    })

    describe('after construction', () => {
      beforeEach(() => {
        sequence = new NoteSequence(['E4', 'F4', 'G4'])
        sequence.selectFirst()
        rebar = jest.fn()
        NoteSequence.prototype.rebar = rebar
      })

      it('triggers on call to add', () => {
        sequence.add(e)
        expect(rebar).toHaveBeenCalled()
      })
    })
  })

  describe('double and halve duration', () => {
    it('doubles duration', () => {
      const sequence = new NoteSequence()
      sequence.addAll([new Note('E4', Duration.quarter)])
      sequence.selectFirst()

      sequence.doubleSelectedDuration()

      expect(sequence.firstNote().duration).toEqual(Duration.half)
    })

    it('halves duration', () => {
      const sequence = new NoteSequence()
      sequence.addAll([new Note('E4', Duration.quarter)])
      sequence.selectFirst()

      sequence.halveSelectedDuration()

      expect(sequence.firstNote().duration).toEqual(Duration.eighth)
    })
  })

  describe('decrements and increments duration', () => {
    let sequence

    beforeEach(() => {
      sequence = new NoteSequence()
    })

    it('decrements duration', () => {
      sequence.addAll([new Note('E4', '0:1:0')])
      sequence.selectFirst()

      sequence.decrementSelectedDuration()

      expect(sequence.firstNote().duration).toEqual('0:0:3')
    })

    it('increments duration', () => {
      const sequence = new NoteSequence()
      sequence.addAll([new Note('E4', '0:0:3')])
      sequence.selectFirst()

      sequence.incrementSelectedDuration()

      expect(sequence.firstNote().duration).toEqual('0:1:0')
    })
  })

  describe('sequence with 3 notes', () => {
    beforeEach(() => {
      sequence = new NoteSequence(['E4', 'F4', 'G4'])
    })

    describe('note sequence', () => {
      it('allows adding notes', () => {
        sequence.add(new Note('A4'))

        expect(sequence.allNoteNames()).toEqual(['E4', 'F4', 'G4', 'A4'])
      })

      it('adds rests and keeps them that way', () => {
        const rest = Note.Rest(Duration.quarter)

        sequence.add(rest)

        const retrieved = sequence.lastNote()
        expect(retrieved.isRest()).toBeTruthy()
      })
    })

    describe('isNoteSelected', () => {
      it('returns true after selection', () => {
        sequence.selectFirst()

        expect(sequence.isNoteSelected()).toBeTruthy()
      })

      it('returns false by default', () => {
        expect(sequence.isNoteSelected()).toBeFalsy()
      })
    })

    describe('note selection', () => {
      it('returns null when no note selected', () => {
        const currentNote = sequence.selectedNote()

        expect(currentNote.name()).toEqual('null')
      })

      it('returns selected note', () => {
        sequence.selectFirst()

        expect(sequence.selectedNote().name()).toEqual('E4')
      })
    })

    describe('click on position', () => {
      it('deselects if already selected', () => {
        sequence.selectFirst()

        sequence.click(0)

        expect(sequence.firstNote().isSelected).toBeFalsy()
      })

      it('selects if not selected', () => {
        sequence.selectLast()

        sequence.click(0)

        expect(sequence.firstNote().isSelected).toBeTruthy()
        expect(sequence.lastNote().isSelected).toBeFalsy()
      })

      it('deselects on selection', () => {
        sequence.selectLast()

        sequence.selectFirst()

        expect(sequence.firstNote().isSelected).toBeTruthy()
        expect(sequence.lastNote().isSelected).toBeFalsy()
      })
    })

    describe('clickHitNote', () => {
      it('returns false when no note hit', () => {
        const clickPoint = { x: -1, y: -1 }

        const wasNoteHit = sequence.clickHitNote(clickPoint)

        expect(wasNoteHit).toBeFalsy()
      })

      describe('hit note', () => {
        let firstNoteClickPoint
        let note

        beforeEach(() => {
          const position = 1
          note = sequence.note(position)
          note.position = position
          firstNoteClickPoint = { x: note.x(), y: note.y() }
        })

        it('returns true when note hit', () => {
          const wasNoteHit = sequence.clickHitNote(firstNoteClickPoint)

          expect(wasNoteHit).toBeTruthy()
        })

        it('clicks note hit', () => {
          sequence.clickHitNote(firstNoteClickPoint)

          expect(note.isSelected)
        })
      })
    })

    describe('next/prev bar', () => {
      const bar1Note1 = 'E4'
      const bar2Note1 = 'F4'
      const bar3Note1 = 'F4'
      const other = 'C1'
      beforeEach(() => {
        sequence = new NoteSequence(
          [bar1Note1, other, other, other, 
          bar2Note1, other, other, other,
          bar3Note1, other, other, other
        ])
      })

      it('selects first of prev', () => {
        sequence.selectLast();

        sequence.selectPrevBar();

        expect(sequence.selectedNote().name()).toEqual(bar2Note1)
      })

      it('selects first of prev when selected is last note of bar', () => {
        sequence.select(3);

        sequence.selectPrevBar();

        expect(sequence.selectedNote().name()).toEqual(bar3Note1)
      })

      it('selects first of last bar when selected is in first bar', () => {
        sequence.selectFirst();

        sequence.selectPrevBar();

        expect(sequence.selectedNote().name()).toEqual(bar3Note1)
      })

      it('selects first of next bar', () => {
        sequence.selectFirst();

        sequence.selectNextBar();

        expect(sequence.selectedNote().name()).toEqual(bar2Note1)
      })

      it('selects first of next bar when selected is last note of bar', () => {
        sequence.select(3);

        sequence.selectNextBar();

        expect(sequence.selectedNote().name()).toEqual(bar2Note1)
      })

      it('selects first note when selected is in last bar', () => {
        sequence.selectLast();

        sequence.selectNextBar();

        expect(sequence.selectedNote().name()).toEqual(bar1Note1)
      })
    })

    describe('next/prev note', () => {
      it('sets selected to subsequent note', () => {
        sequence.selectFirst()
        const first = sequence.selectedNote()

        sequence.selectNext()

        const note = sequence.selectedNote()
        expect(note.name()).toEqual('F4')
        expect(note.isSelected).toBeTruthy()
        expect(first.isSelected).toBeFalsy()
      })

      it('sets selected to previous note', () => {
        sequence.selectFirst()
        const first = sequence.selectedNote()

        sequence.selectPrev()

        const note = sequence.selectedNote()
        expect(note.name()).toEqual('G4')
        expect(note.isSelected).toBeTruthy()
        expect(first.isSelected).toBeFalsy()
      })

      it('sets selected to null if there is no current selection is empty', () => {
        sequence.selectNext()

        expect(sequence.selectedNote().name()).toBe('null')
      })

      it('prev sets selected to null if no current selection is empty', () => {
        sequence.selectPrev()

        expect(sequence.selectedNote().name()).toBe('null')
      })
    })
  })
})