import { actionConstants } from '../constants/actionConstants.jsx'
import { appConstants } from '../constants/appConstants.jsx'
import fetch from 'isomorphic-fetch'

// ***** Ajax Requests *****
export function getDangerzones() {
    return dispatch => {
        fetch(appConstants.API + '/dangerzones')
            .then((response) => response.json())
            .then(json => dispatch(receivedDangerzones(json)))
    }
}

function receivedDangerzones(data) {
    return {
        type: actionConstants.RECEIVED_DANGERZONES,
        data: data
    }
}
