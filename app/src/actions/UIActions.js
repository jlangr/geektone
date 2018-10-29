import * as type from './types'

export const keyFocusUpdate = component => ({type: type.KEY_FOCUS_UPDATE, payload: component })

export const setSelectionStart = (clickPoint, canvasHeight) => 
  ({ type: type.SET_SELECTION_START, payload: { clickPoint, canvasHeight } })