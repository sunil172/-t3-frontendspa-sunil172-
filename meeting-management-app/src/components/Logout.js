import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class Logoutbutton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLogout: false
		};
	}
	handleLogout = () => {
		this.setState({
			isLogout: true
		});
	};
	render() {
		if (this.state.isLogout) {
			localStorage.clear();
			window.location.href = '/';
		}
		return (
			<div>
				<label onClick={this.handleLogout}>Logout</label>
				{/* <Button onClick={this.handleLogout} color="warning">
					Logout
				</Button> */}
			</div>
		);
	}
}
