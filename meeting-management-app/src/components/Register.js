import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Jumbotron } from 'reactstrap';
import Axios from 'axios';
import { Redirect } from 'react-router';

export default class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fullname: '',
			designation: '',
			organization: '',
			org_address: '',
			contact: '',
			email: '',
			password: '',
			isCreated: false,
			isCancel: false
		};
	}
	handleChange = (e) =>
		this.setState({
			[e.target.name]: e.target.value
		});
	handleSubmit = (e) => {
		e.preventDefault();
		Axios.post('http://localhost:3001/api/users/register', this.state)
			.then((res) => {
				console.log(res);
				this.setState({ isCreated: true });
			})
			.catch((err) => console.log(err));
	};
	handleCancel = () => this.setState({ isCancel: true });

	render() {
		if (this.state.isCreated) {
			return <Redirect to="/" />;
		} else if (this.state.isCancel) {
			return <Redirect to="/" />;
		}
		return (
			<div>
				<Jumbotron className="loginForm jumbotron-fluid col-xl-6">
					<div className="container">
						<div className="loginTitle">
							<h3>MEETING MANAGEMENT SYSTEM</h3>
							<p>Register Form</p>
						</div>

						<Form>
							<FormGroup>
								<Input
									type="text"
									name="fullname"
									id="fullname"
									placeholder="Enter Your Full Name"
									value={this.state.fullname}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									type="text"
									name="designation"
									id="designation"
									placeholder="Enter Your Current Position"
									value={this.state.designation}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									type="text"
									name="organization"
									id="organization"
									placeholder="Enter Your Organization Name"
									value={this.state.organization}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									type="text"
									name="org_address"
									id="org_address"
									placeholder="Enter Your Organization Adress"
									value={this.state.org_address}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									type="text"
									name="contact"
									id="contact"
									placeholder="Enter your contact Number"
									value={this.state.contact}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									type="text"
									name="email"
									id="email"
									placeholder="Enter Your Email Address"
									value={this.state.email}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									type="password"
									name="password"
									id="password"
									placeholder="Enter new Password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<Button color="primary" block onClick={this.handleSubmit}>
								Register User
							</Button>
							<Button color="secondary" block onClick={this.handleCancel}>
								Cancel
							</Button>
						</Form>
					</div>
				</Jumbotron>
			</div>
		);
	}
}
