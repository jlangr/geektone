import { noteToFileMapping } from './SynthActions'

describe('noteToFileMapping', () => {
  it('converts note name to filename', () => {
    expect(noteToFileMapping('piano')['A0']).toEqual('A0.mp3')
  })

  it('converts sharp in name to s', () => {
    expect(noteToFileMapping('violin')['D#1']).toEqual('Ds1.mp3')
  })
})