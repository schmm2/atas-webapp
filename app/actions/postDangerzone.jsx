import { appConstants } from '../constants/appConstants.jsx'
import { actionConstants } from '../constants/actionConstants.jsx'
import fetch from 'isomorphic-fetch'

// ***** Ajax Requests *****
export function postDangerzone(dangerzonePointsArray) {
    return dispatch => {
        fetch(appConstants.API + '/dangerzones',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                points: dangerzonePointsArray
            })
        })
        .then((response) => response.json())
        .then((response) => dispatch(addDangerzone(response)))
        .catch((err) => {
            console.log("error", err)
        });
    }
}

function addDangerzone(data) {
    return {
        type: actionConstants.ADD_DANGERZONE,
        data: data
    }
}