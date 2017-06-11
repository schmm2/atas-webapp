import { actionConstants } from '../constants/actionConstants.jsx'

const dangerzones = (state = [], action) => {
    switch (action.type) {
        case actionConstants.RECEIVED_DANGERZONES:
            return action.data;
        case actionConstants.DELETED_DANGERZONE:
            var dangerzoneId = action.data;
            return state.filter(dangerzones => dangerzones._id != dangerzoneId);
        case actionConstants.ADD_DANGERZONE:
            return state.concat([action.data]);
        default:
            return state;
    }
};
export default dangerzones;