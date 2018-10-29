import Note from './Note'
import * as Constants from './Constants'
import * as Duration from './Duration'
import Tie from './Tie'
import * as Draw from './util/Draw'

describe('note', () => {
  describe('a note', () => {
    it('defaults to quarter note', () => {
      expect(new Note('F3').duration).toEqual(Duration.quarter)
    })

    it('answers number of sixteenths', () => {
      expect(new Note('F3', Duration.quarter).sixteenths()).toEqual(4)
      expect(new Note('F3', Duration.dottedQuarter).sixteenths()).toEqual(6)
    })

    it('answers number of dot sixteenths for dotted notes', () => {
      expect(new Note('F3', '0:1:2').sixteenthsInTheDot()).toEqual(2)
      expect(new Note('F3', Duration.dottedEighth).sixteenthsInTheDot()).toEqual(1)
    })

    describe('is higher or equal to', () => {
      it('returns true when note in same octave and higher', () => {
        expect(new Note('F3').isHigherOrEqual(new Note('E3'))).toBeTruthy()
      })

      it('returns false when note in same octave and not higher', () => {
        expect(new Note('F3').isHigherOrEqual(new Note('G3'))).toBeFalsy()
      })

      it('returns true when note in higher octave', () => {
        expect(new Note('F4').isHigherOrEqual(new Note('G3'))).toBeTruthy()
      })

      it('returns false when note in lower octave', () => {
        expect(new Note('F3').isHigherOrEqual(new Note('E4'))).toBeFalsy()
      })
    })
  })

  describe('whole note increment/decrement', () => {
    it('bumps up', () => {
      const note = new Note('C4')
      note.increment()
      expect(note.name()).toEqual('D4')
    })

    it('increments octave when necessary', () => {
      const note = new Note('B4')
      note.increment()
      expect(note.name()).toEqual('C5')
    })

    it('decrements octave when necessary', () => {
      const note = new Note('C4')
      note.decrement()
      expect(note.name()).toEqual('B3')
    })

    it('ignores attempts to go below lowest note', () => {
      const note = new Note('E1')
      note.decrement()
      expect(note.name()).toEqual('E1')
    })

    it('ignores attempts to go above highest note', () => {
      const note = new Note('A4')
      note.increment()
      expect(note.name()).toEqual('A4')
    })

    it('does not increment when rest', () => {
      const note = new Note('C4')
      note.restToggle()

      note.increment()

      expect(note.name()).toEqual('C4')
    })

    it('does not decrement when rest', () => {
      const note = new Note('C4')
      note.restToggle()

      note.decrement()

      expect(note.name()).toEqual('C4')
    })
  })

  describe('to JSON', () => {
    it('converts a basic note', () => {
      expect(new Note('F3', Duration.eighth).toJSON())
        .toEqual({name: 'F3', duration: Duration.eighth, isNote: true})
    })

    it('includes whether or not it is a rest', () => {
      const note = new Note('F3', Duration.quarter)
      note.restToggle()

      const json = note.toJSON()

      expect(json).toEqual({name: 'F3', duration: Duration.quarter, isNote: false})
    })
  })

  describe('dotted notes', () => {
    describe('property', () => {
      it('is false when not dotted', () => {
        expect(new Note('F2', Duration.quarter).isDotted()).toBeFalsy()
      })

      it('is true when dotted', () => {
        expect(new Note('F2', '0:1:2').isDotted()).toBeTruthy()
      })
    })

    describe('toggle', () => {
      it('toggles dot to non dotted note', () => {
        const note = new Note('F2', Duration.quarter)

        note.toggleDot()

        expect(note.duration).toEqual(Duration.dottedQuarter)
      })

      it('removes dot from dotted note', () => {
        const note = new Note('F2', '0:3:0')

        note.toggleDot()

        expect(note.duration).toEqual(Duration.half)
      })

      it('toggles whole notes', () => {
        const note = new Note('G4', Duration.whole)

        note.toggleDot()

        expect(note.duration).toEqual('1:2:0')
      })

      it('does not toggle 16th notes', () => {
        const note = new Note('G4', Duration.sixteenth)

        note.toggleDot()

        expect(note.duration).toEqual(Duration.sixteenth)
      })

      // TODO it does not toggle ties!
    })
  })

  describe('hit testing', () => {
    it('is false when click does not hit', () => {
      const note = new Note('D4')
      note.setPosition(0)

      const isHit = note.isHit({ x: note.x() + 1000, y: note.y() })

      expect(isHit).toBeFalsy()
    })

    it('is true when click is a hit', () => {
      const note = new Note('D4')
      note.setPosition(0)

      const isHit = note.isHit({ x: note.x(), y: note.y() })

      expect(isHit).toBeTruthy()
    })

    it('is true when a tie is hit', () => {
      const tieStart = new Tie('D4')
      tieStart.setPosition(0)
      const tieEnd = new Tie('D4')
      tieEnd.setPosition(1)
      const note = new Note('D4', Duration.half)
      note.setTies([tieStart], [tieEnd])
      note.setPosition(0)

      const isHit = note.isHit({ x: tieEnd.x(), y: note.y() })

      expect(isHit).toBeTruthy()
    })

    it('is true when rest and click in highlight rectangle', () => {
      const note = new Note('C4')
      note.setPosition(0)
      note.restToggle()

      const isHit = note.isHit({ x: note.x(), y: Draw.y(Constants.restRectangleTop) + 1 })

      expect(isHit).toBeTruthy()
    })

    it('is false when rest and click outside highlight rectangle', () => {
      const note = new Note('C4')
      note.setPosition(0)
      note.restToggle()

      const isHit = note.isHit({ x: note.x(), y: Draw.y(Constants.restRectangleTop) - 1 })

      expect(isHit).toBeFalsy()
    })
  })

  describe('ties', () => {
    let note
    beforeEach(() => {
      note = new Note('G4', Duration.half)
      note.setTies([new Note('G4', Duration.quarter)],
                   [new Note('G4', Duration.quarter)])
    })

    it('is tie when first (from) Tie exists', () => {
      expect(note.isRepresentedAsTie()).toBeTruthy()
    })

    it('is not a tie when cleared', () => {
      note.clearTie()

      expect(note.isRepresentedAsTie()).toBeFalsy()
    })

    it('increments the tie value', () => {
      note.increment()

      expect(note.name()).toEqual('A4')
      expect(note.startTies.every(t => t.name() === 'A4')).toBeTruthy()
      expect(note.endTies.every(t => t.name() === 'A4')).toBeTruthy()
    })

    it('decrements the tie value', () => {
      note.decrement()

      expect(note.name()).toEqual('F4')
      expect(note.startTies.every(t => t.name() === 'F4')).toBeTruthy()
      expect(note.endTies.every(t => t.name() === 'F4')).toBeTruthy()
    })
  })

  describe('rest', () => {
    it('is not rest by default', () => {
      const note = new Note('D5')

      expect(note.isRest()).toBeFalsy()
    })

    it('converts note to rest on toggle', () => {
      const note = new Note('D5')

      note.restToggle()

      expect(note.isRest()).toBeTruthy()
    })

    it('can be created via factory method', () => {
      const rest = Note.Rest(Duration.half)

      expect(rest.isRest()).toBeTruthy()
      expect(rest.duration).toEqual(Duration.half)
    })

    it('defaults to quarter rest by default', () => {
      const rest = Note.Rest()

      expect(rest.duration).toEqual(Duration.quarter)
    })

    it('converts from rest to note on toggle', () => {
      const rest = Note.Rest()

      rest.restToggle()

      expect(rest.isRest()).toBeFalsy()
    })
  })

  describe('select / deselect', () => {
    it('also selects any ties', () => {
      const note = new Note('E4', Duration.half)
      note.setTies([new Tie('E4'), new Tie('F5')], [new Tie('E4')])

      note.select()
      
      expect(note.isSelected).toBeTruthy()
      expect(note.startTies.every(t => t.isSelected)).toBeTruthy()
      expect(note.endTies.every(t => t.isSelected)).toBeTruthy()
    })
    
    it('also deselects any ties', () => {
      const note = new Note('E4', Duration.half)
      note.setTies([new Tie('E4')], [new Tie('E4')])
      note.select()

      note.deselect()
      
      expect(note.isSelected).toBeFalsy()
      expect(note.startTies.every(t => t.isSelected)).toBeFalsy()
      expect(note.endTies.every(t => t.isSelected)).toBeFalsy()
    })
  })
})