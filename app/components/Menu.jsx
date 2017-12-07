import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { closeMenu } from '../actions/menu.jsx'

// Icons
import Data from 'material-ui/svg-icons/device/data-usage';
import Terrain from 'material-ui/svg-icons/maps/terrain';
import Person from 'material-ui/svg-icons/social/person';

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
				>
					<MenuItem onClick={ this.props.closeMenu }
							  containerElement={<Link to="/"/>}
							  leftIcon={<Terrain/>}
							  primaryText="Map" />
					<MenuItem onClick={ this.props.closeMenu }
							  containerElement={<Link to="/data"/>}
							  leftIcon={<Data/>}
							  primaryText="Data" />
					<MenuItem onClick={ this.props.closeMenu }
							  containerElement={<Link to="/aboutus"/>}
							  leftIcon={<Person/>}
							  primaryText="About" />
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