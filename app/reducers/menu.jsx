import { actionConstants } from '../constants/actionConstants.jsx'

const menu_initialState = {
    visibility: false
}

const menu = (state = menu_initialState, action) => {
    switch (action.type) {
        case actionConstants.TOGGLE_MENU:
            //console.log('toggle_menu');
            return Object.assign({}, state, {
                visibility: !state.visibility
            })
        case actionConstants.CLOSE_MENU:
            //console.log('close_menu');
            return Object.assign({}, state, {
                visibility: false
            })
        default:
            return state
    }
};
export default menu;