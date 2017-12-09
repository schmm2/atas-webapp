import { actionConstants } from '../constants/actionConstants.jsx'
import { appConstants } from '../constants/appConstants.jsx'
import fetch from 'isomorphic-fetch'

// ***** Ajax Requests *****
export function getNodeData(nodeid) {
    return dispatch => {
        fetch(appConstants.API + '/nodes/'+nodeid)
            .then((response) => response.json())
            .then(json => dispatch(receivedNodeData(json)))
    }
}

function receivedNodeData(data) {
    // make sure newest entries are at the top
    let sorteddata = data.sort((a, b) => new Date(b.time) - new Date(a.time));
    return {
        type: actionConstants.RECEIVED_NODEDATA,
        data: sorteddata
    }
}