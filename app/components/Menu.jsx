import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { closeMenu } from '../actions/menu.jsx'

const Menu = props => (
	<div>
		<Drawer id="menu" open={ props.visibility }>
			<MenuItem onClick={ props.closeMenu } containerElement={<Link to="/" />}>About</MenuItem>
			<MenuItem onClick={ props.closeMenu } containerElement={<Link to="/map" />}>Map</MenuItem>
		</Drawer>
	</div>
);

// mappings
function mapStateToProps(store){
	return {
		visibility: store.menu.visibility	
	};
}

// mappings
function mapDispatchToProps(dispatch){
	return {
		closeMenu: function(){ dispatch(closeMenu()); }	
	};
}

const VisibleMenu = connect(mapStateToProps,mapDispatchToProps)(Menu)

export default VisibleMenu; 