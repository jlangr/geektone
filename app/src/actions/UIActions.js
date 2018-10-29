import * as type from './types'

export const keyFocusUpdate = (component, event) => ({type: type.KEY_FOCUS_UPDATE, payload: { component, event }})

export const setSelectionStart = (clickPoint, canvasHeight) => 
  ({ type: type.SET_SELECTION_START, payload: { clickPoint, canvasHeight } })