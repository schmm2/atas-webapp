import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MyAppBar from '../AppBar.jsx';
import VisibleMenu from '../Menu.jsx';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: "#00bcd4",
        primary2Color: "#BABCBE",
        textColor: "#1A1C1D"
    },
    appBar:{
        textColor: "#1A1C1D",
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