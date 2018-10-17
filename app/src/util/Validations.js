const prohibitedSymbols = ['!', '<', '>~', '\\', '/', '?', '*', ':', '|']

export const isValidCrossOSFilename = filename =>
  !filename.split('').some(c => 
    c.charCodeAt(0) < 32 || 
    c.charCodeAt(0) >= 127 ||
    prohibitedSymbols.includes(c))