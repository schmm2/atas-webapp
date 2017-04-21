import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { closeMenu } from '../actions/menu.jsx'

class Menu extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
			<div>
				<Drawer id="menu"
						open={ this.props.visibility }
						docked={false}
						onRequestChange={console.log("sssdsds")}
				>
					<MenuItem onClick={ this.props.closeMenu }containerElement={<Link to="/"/>}>About</MenuItem>
					<MenuItem onClick={ this.props.closeMenu } containerElement={<Link to="/map"/>}>Map</MenuItem>
				</Drawer>
			</div>
        );
    }
}

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