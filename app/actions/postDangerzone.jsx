import { appConstants } from '../constants/appConstants.jsx'
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
    }
}