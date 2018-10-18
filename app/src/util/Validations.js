const prohibitedSymbols = ['!', '<', '>~', '\\', '/', '?', '*', ':', '|']

const hasInvalidCharacters = filename =>
  filename.split('').some(c => 
    c.charCodeAt(0) < 32 || 
    c.charCodeAt(0) >= 127 ||
    prohibitedSymbols.includes(c))

const isEmpty = filename => filename.trim().length === 0

export const isValidCrossOSFilename = filename =>
  !isEmpty(filename) && !hasInvalidCharacters(filename)