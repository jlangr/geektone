import * as type from './types'

export const setSelectionStart = (clickPoint, canvasHeight) => 
  ({ type: type.SET_SELECTION_START, payload: { clickPoint, canvasHeight } })