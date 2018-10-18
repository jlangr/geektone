import { isValidCrossOSFilename } from './Validations'

describe('filename validation', () => {
  it('is valid when it contains all alphabetics or numerics', () => {
    expect(isValidCrossOSFilename('abcd123')).toBeTruthy()
  })

  it('is invalid when it contains prohibited characters', () => {
    expect(isValidCrossOSFilename('abc<123')).toBeFalsy()
  })

  it('is invalid when it contains low end characters', () => {
    expect(isValidCrossOSFilename('abc\t123')).toBeFalsy()
  })

  it('is invalid when it contains high end characters', () => {
    const someHighEndCharacter = '\u266D'
    expect(isValidCrossOSFilename(`abc${someHighEndCharacter}123`)).toBeFalsy()
  })

  it('is not valid when it is empty after stripping', () => {
    expect(isValidCrossOSFilename('   ')).toBeFalsy()
  })
})