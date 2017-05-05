import { combineReducers } from 'redux'
import menu from './menu.jsx';
import dangerzones from './dangerzones.jsx';

const AppReducer = combineReducers({
    menu,
    dangerzones
})

export default AppReducer;