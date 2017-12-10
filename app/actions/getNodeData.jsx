import { actionConstants } from '../constants/actionConstants.jsx'
import { appConstants } from '../constants/appConstants.jsx'
import fetch from 'isomorphic-fetch'

// ***** Ajax Requests *****
export function getNodeData(nodeid) {
        return dispatch => {
            return fetch(appConstants.API + '/nodes/'+nodeid)
                .then((response) => response.json())
                .then(json => dispatch(storeUplinkMessages(json)))
                .then(json => dispatch(storeGateways(json)))
        }
}

function storeGateways(json){
    var data = json.data;
    var gateways = [];
    for(var i = 0; i < data.length; i++){
        for(var g = 0; g < data[i].gateways.length; g++){
            if(gateways.indexOf(data[i].gateways[g].gtw_id) === -1){ gateways.push(data[i].gateways[g].gtw_id)};
        }
    }
    return {
        type: actionConstants.STORE_GATEWAYS,
        data: gateways
    }
}

function storeUplinkMessages(data) {
    // sort date
    let sorteddata = data.sort((a, b) => new Date(b.time) - new Date(a.time));
    return {
        type: actionConstants.STORE_UPLINKMESSAGES,
        data: sorteddata
    }
}