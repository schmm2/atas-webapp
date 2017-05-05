import React from 'react';
import AppBar from 'material-ui/AppBar';
import { connect } from 'react-redux';
import {white} from 'material-ui/styles/colors';

// actions
import { toggleMenu } from '../actions/menu.jsx'
import { appConstants } from '../constants/appConstants.jsx'

const MyAppBar = props => (
	<AppBar
		style={{backgroundColor: white}}
		title={appConstants.NAME}
		iconClassNameRight="muidocs-icon-navigation-expand-more"
		onLeftIconButtonTouchTap={ props.toggleMenu }
	/>
);

var mapStateToProps = function(state){
	return {};
};


// mappings
function mapDispatchToProps(dispatch){
	return {
		toggleMenu: function(){ dispatch(toggleMenu()); }	
	};
}

const VisibleAppBar = connect(mapStateToProps,mapDispatchToProps)(MyAppBar)

export default VisibleAppBar;