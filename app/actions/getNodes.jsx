import { actionConstants } from '../constants/actionConstants.jsx'
import { appConstants } from '../constants/appConstants.jsx'
import fetch from 'isomorphic-fetch'

// ***** Ajax Requests *****
export function getNodes() {
    return dispatch => {
        fetch(appConstants.API + '/nodes')
            .then((response) => response.json())
            .then(json => dispatch(receivedNodes(json)))
    }
}

function receivedNodes(data) {
    return {
        type: actionConstants.RECEIVED_NODES,
        data: data
    }
}
