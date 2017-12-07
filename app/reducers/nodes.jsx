import { actionConstants } from '../constants/actionConstants.jsx'

const nodes = (state = [], action) => {
    switch (action.type) {
        case actionConstants.RECEIVED_NODES:
            return action.data;
        default:
            return state;
    }
};
export default nodes;