import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Axios from 'axios';
import { Redirect } from 'react-router';

export default class AddParticipants extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fullname: '',
			designation: '',
			organization: '',
			org_address: '',
			contact: '',
			email: '',
			isCreated: false,
			isCancel: false,
			config: {
				headers: { Authorization: localStorage.getItem('token') }
			}
		};
	}
	handleChange = (e) =>
		this.setState({
			[e.target.name]: e.target.value
		});
	handleSubmit = (e) => {
		e.preventDefault();
		Axios.post(
			'http://localhost:3001/api/participants',
			{
				fullname: this.state.fullname,
				designation: this.state.designation,
				organization: this.state.organization,
				org_address: this.state.org_address,
				contact: this.state.contact,
				email: this.state.email
			},
			this.state.config
		)
			.then((res) => {
				console.log(res);
				this.setState({ isCreated: true });
			})
			.catch((err) => console.log(err));
	};
	handleCancel = () => this.setState({ isCancel: true });

	render() {
		if (this.state.isCreated) {
			return <Redirect to="/dash/participant" />;
		} else if (this.state.isCancel) {
			return <Redirect to="/dash/participant" />;
		}
		return (
			<div>
				<div className="title">
					<div className="float-left">
						<h1>Add Participant Form</h1>
					</div>
				</div>
				<center>
					<Form className="w-50">
						<FormGroup>
							<Label for="fullname">Full Name</Label>
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
							<Label for="designation">Designation</Label>
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
							<Label for="organization">Organization</Label>
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
							<Label for="org_address">Organization Address</Label>
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
							<Label for="contact">Cotact</Label>
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
							<Label for="email">Email</Label>
							<Input
								type="text"
								name="email"
								id="email"
								placeholder="Enter Your Email Address"
								value={this.state.email}
								onChange={this.handleChange}
							/>
						</FormGroup>

						<Button color="primary" block onClick={this.handleSubmit}>
							Add Participant
						</Button>
						<Button color="secondary" block onClick={this.handleCancel}>
							Cancel
						</Button>
					</Form>
				</center>
			</div>
		);
	}
}
