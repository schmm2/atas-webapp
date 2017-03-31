//***** Import *****
import 'babel-polyfill'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

// react
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux'


// Components
import App from './components/App/App.jsx';
import Map from './components/Map/Map.jsx';
import NoMatch from './components/NoMatch.jsx';
import StartPage from './components/StartPage.jsx';
import AppReducer from './reducers/index.jsx';

//***** Flow *****

const loggerMiddleware = createLogger()

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const middleware = routerMiddleware(browserHistory)

// Redux store
let store = createStore(AppReducer,
	applyMiddleware(
		thunkMiddleware, // lets us dispatch() functions
		loggerMiddleware, // neat middleware that logs actions
		middleware
	)
);

var app = (
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route component={App}>
				<Route path="/" component={StartPage} />
				<Route path="/map" component={Map} />
				<Route path="*" component={NoMatch}/>
			</Route>
		</Router>
	</Provider>
);
ReactDOM.render(app, document.getElementById('root'));
