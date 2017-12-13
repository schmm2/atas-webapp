import { actionConstants } from '../constants/actionConstants.jsx'

const initialState = {
    uplinkmessages: [],
    gateways: []
}

const nodes = (state = initialState, action) => {
    switch (action.type) {
        case actionConstants.STORE_UPLINKMESSAGES:
            return Object.assign({}, state, {
                uplinkmessages: action.data
            })
        case actionConstants.STORE_GATEWAYS:
            return Object.assign({}, state, {
                gateways: action.data
            })
        default:
            return state;
    }
};
export default nodes;