import { actionConstants } from '../constants/actionConstants.jsx'

export function toggleMenu() {
    return { type: actionConstants.TOGGLE_MENU }
}

export function closeMenu() {
    return { type: actionConstants.CLOSE_MENU }
}