import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Jumbotron } from 'reactstrap';
import axios from 'axios';
import jwt from 'jwt-decode';
import { Redirect } from 'react-router';
import '../assets/myStyle.css';

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			isAdmin: false,
			isUser: false,
			isRegister: false
		};
	}

	handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
	handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post('http://localhost:3001/api/users/login', this.state)
			.then((res) => {
				console.log(res);
				localStorage.setItem('token', res.data.token);
				let user = jwt(res.data.token.split(' ')[1]);
				if (user.role === 'admin') this.setState({ isAdmin: true });
				else this.setState({ isUser: true });
			})
			.catch((err) => console.log(err));
	};
	handleRegister = (e) => {
		e.preventDefault();
		this.setState({ isRegister: true });
	};

	render() {
		if (this.state.isUser) {
			return <Redirect to="/dash" />;
		} else if (this.state.isAdmin) {
			return <Redirect to="/dash" />;
		} else if (this.state.isRegister) {
			return <Redirect to="/register" />;
		}
		return (
			<div>
				<Jumbotron className="loginForm jumbotron-fluid col-xl-4">
					<div className="container">
						<div className="loginTitle">
							<h3>MEETING MANAGEMENT SYSTEM</h3>
							<p>Login Form</p>
						</div>

						<Form className="was-validated">
							<FormGroup>
								<Input
									type="text"
									name="email"
									id="email"
									placeholder="Username"
									value={this.state.username}
									onChange={this.handleChange}
									required
								/>
							</FormGroup>
							<FormGroup>
								<Input
									type="password"
									name="password"
									id="password"
									placeholder="Password"
									value={this.state.password}
									onChange={this.handleChange}
									required
								/>
							</FormGroup>
							<Button block color="primary" onClick={this.handleSubmit}>
								Login
							</Button>
							<Button block color="info" onClick={this.handleRegister}>
								Register
							</Button>
						</Form>
					</div>
				</Jumbotron>
			</div>
		);
	}
}
