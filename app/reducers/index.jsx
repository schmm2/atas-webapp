import { combineReducers } from 'redux'
import menu from './menu.jsx';
import dangerzones from './dangerzones.jsx';
import nodes from './nodes.jsx';
import nodedata from './nodedata.jsx';

const AppReducer = combineReducers({
    menu,
    dangerzones,
    nodes,
    nodedata
})
export default AppReducer;