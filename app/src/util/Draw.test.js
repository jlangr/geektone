import { position, x, xLeftOffset, xPositionSpan } from './Draw'

describe('it calculates x based on position', () => {
  it('is to the left if 0', () => {
    expect(x(0)).toEqual(xLeftOffset)
  })

  it('is one position span per position', () => {
    expect(x(3)).toEqual(xLeftOffset + 3 * xPositionSpan)
  })
})

describe('determining first position after x', () => {
  it('is 0 when at left offset', () => {
    expect(position(xLeftOffset)).toEqual(0)
  })

  it('is 1 when after first note but up to 2nd', () => {
    expect(position(xLeftOffset + xPositionSpan + 1)).toEqual(1)
  })

  it('is index of nth note', () => {
    expect(position(xLeftOffset + (3 * xPositionSpan) + 1)).toEqual(3)
  })
})
