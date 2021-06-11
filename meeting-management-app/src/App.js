import React from 'react';
import './App.css';
import Login from './components/Login';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './components/user/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';
import AddParticipants from './components/AddParticipants';
import EditParticipants from './components/EditParticipants';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={Login} />
					<Route path="/register" component={Register} />
					<PrivateRoute path="/dash" component={Dashboard} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
