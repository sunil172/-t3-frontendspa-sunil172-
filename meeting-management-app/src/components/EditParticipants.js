import React, { Component, params } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

/*
export default function EditParticipants(props) {
	let { pid } = useParams();
	return (
		<div>
			<p>this is participnat id {pid}</p>
		</div>
	);
} */

export default class EditParticipants extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pid: '',
			fullname: '',
			designation: '',
			organization: '',
			org_address: '',
			contact: '',
			email: '',
			participants: [],
			isUpdated: false,
			isCancel: false
		};
		function getpid() {
			
		}
	}

	componentDidMount(props) {
		//let { pid } = useParams();
		//let {pid}=useParams();
		//console.log(pid);
		Axios.get('http://localhost:3001/api/participants/', this.state.config)
			.then((res) => {
				console.log(res.data);
				this.setState({
					participants: res.data
				});
			})
			.catch((err) => console.log(err.response));
	}

	render() {
		//let { participantId } = useParams();
		return (
			<div>
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

		// function getParticipantId(props) {
		// 	let { participantId } = useParams();
		// 	return (
		// 		<div>
		// 			<h1>this participant id {participantId}</h1>
		// 		</div>
		// 	);
		// }
	}
}
