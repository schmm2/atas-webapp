import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan700} from 'material-ui/styles/colors';

import MyAppBar from '../AppBar.jsx';
import VisibleMenu from '../Menu.jsx';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: "#FFFFFF",
        primary2Color: "#BABCBE",
		textColor: "#1A1C1D"
    },
	appBar:{
        textColor: "#1A1C1D",
		fontStyle: "italic"
	}
});

// Stylesheets
require('./app.scss');

class App extends React.Component {
	render(){
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					<MyAppBar />
					<VisibleMenu />
					<div id="main">
						{this.props.children}
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}
export default App;