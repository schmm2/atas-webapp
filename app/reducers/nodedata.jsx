import { actionConstants } from '../constants/actionConstants.jsx'

const nodes = (state = [], action) => {
    switch (action.type) {
        case actionConstants.RECEIVED_NODEDATA:
            return action.data;
        default:
            return state;
    }
};
export default nodes;