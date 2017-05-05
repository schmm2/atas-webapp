import { actionConstants } from '../constants/actionConstants.jsx'
import { appConstants } from '../constants/appConstants.jsx'
import fetch from 'isomorphic-fetch'

// ***** Ajax Requests *****
export function deleteDangerzone(dangerzoneKey) {
    return dispatch => {
        fetch(appConstants.API + '/dangerzones/' + dangerzoneKey,{
            method: 'DELETE'
        })
        .then((response) => {
            console.log(response);
            // element deleted successfully
            if(response.status == 200){
                dispatch(deletedDangerzone(dangerzoneKey));
            }
        })
    }
}

function deletedDangerzone(data) {
    return {
        type: actionConstants.DELETED_DANGERZONE,
        data: data
    }
}
