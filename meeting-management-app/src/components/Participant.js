import React, { Component } from 'react';
import { Table, Button, Label, Input, ModalHeader, ModalFooter, ModalBody, Modal, FormGroup, Form } from 'reactstrap';
import Axios from 'axios';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import '../assets/myStyle.css';
import jwt from 'jwt-decode';

export default class Participant extends Component {
	constructor(props) {
		super(props);

		this.state = {
			participant_id: '',
			fullname: '',
			designation: '',
			organization: '',
			org_address: '',
			contact: '',
			email: '',
			participants: [],
			isEdit: false,
			isRegister: false,
			isAdmin: false,
			config: {
				headers: { Authorization: localStorage.getItem('token') }
			},
			editParticipantModal: false,
			editParticipant: {
				userId: '',
				fullname: '',
				designation: '',
				contact: '',
				organization: '',
				org_address: '',
				email: ''
			}
		};
	}
	componentDidMount() {
		let bearerToken = localStorage.getItem('token');
		let user = jwt(bearerToken.split(' ')[1]);
		if (user.role === 'admin') this.setState({ isAdmin: true });
		else this.setState({ isAdmin: false });
		console.log(this.state.isAdmin);

		Axios.get('http://localhost:3001/api/participants', this.state.config)
			.then((res) => {
				//console.log(res.data);
				this.setState({
					participants: res.data
				});
			})
			.catch((err) => console.log(err.response));
	}

	// componentWillMount() {
	// 	this.componentDidMount();
	// }

	handleChange = (e) =>
		this.setState(
			{
				editParticipant: { ...this.state.editParticipant, [e.target.name]: e.target.value }
			},
			() => console.log(this.state.editParticipant)
		);

	deleteParticipant = (participant_id) => {
		console.log(participant_id);
		swal({
			title: 'Are you sure want to delete?',
			text: 'Once deleted, you will not be able to recover!',
			icon: 'warning',
			buttons: true,
			dangerMode: true
		}).then((willDelete) => {
			if (willDelete) {
				Axios.delete(`http://localhost:3001/api/participants/${participant_id}`, this.state.config)
					.then((res) => {
						console.log(res.data);

						const singleParticipant = this.state.participants.filter((participant) => {
							return participant._id !== participant_id;
						});
						console.log(singleParticipant);
						this.setState({
							participants: singleParticipant
						});
					})
					.catch((err) => console.log(err.response));

				swal('Participant has been deleted!', {
					icon: 'success'
				});
			} else {
				swal('Your participant is safe!');
			}
		});
	};
	addParticipant = (e) => {
		e.preventDefault();
		this.setState({ isRegister: true });
	};

	toggleEditParticipantModal() {
		this.setState({
			editParticipantModal: !this.state.editParticipantModal
		});
	}

	editParticipant = (userId, fullname, designation, contact, organization, org_address, email) => {
		this.setState(
			{
				editParticipant: { userId, fullname, designation, contact, organization, org_address, email },
				editParticipantModal: !this.state.editParticipantModal
			},
			() => console.log(this.state.editParticipant)
		);
	};

	handleUpdate() {
		let { fullname, designation, contact, organization, org_address, email } = this.state.editParticipant;
		console.log(this.state.editParticipant);
		Axios.put(
			`http://localhost:3001/api/participants/${this.state.editParticipant.userId}`,
			{ fullname, designation, contact, organization, org_address, email },
			this.state.config
		).then((res) => {
			this.componentDidMount();

			this.setState({
				editParticipantModal: false,
				editParticipant: {
					_id: '',
					fullname: '',
					designation: '',
					organization: '',
					org_address: '',
					contact: '',
					email: ''
				}
			});
		});
	}

	render() {
		if (this.state.isRegister) {
			return <Redirect to="/dash/addParticipant" />;
		}

		let participants = this.state.participants.map((participant) => {
			return (
				<tr key={participant._id}>
					<td>{participant.fullname}</td>
					<td>{participant.designation}</td>
					<td>{participant.contact}</td>
					<td>{participant.organization}</td>
					<td>{participant.org_address}</td>
					<td>{participant.email}</td>
					<td>
						<Button
							size="sm"
							color="primary"
							onClick={this.editParticipant.bind(
								this,
								participant._id,
								participant.fullname,
								participant.designation,
								participant.contact,
								participant.organization,
								participant.org_address,
								participant.email
							)}
						>
							EDIT
						</Button>
					</td>
					<td>
						{this.state.isAdmin ? (
							<Button size="sm" color="danger" onClick={() => this.deleteParticipant(participant._id)}>
								Delete
							</Button>
						) : (
							<span />
						)}
					</td>
				</tr>
			);
		});
		return (
			<div className="container">
				<div className="title">
					<div className="float-left">
						<h1>Participants List</h1>
					</div>

					<div className="float-right">
						<Button color="success" onClick={this.addParticipant}>
							ADD
						</Button>
					</div>
				</div>
				<div className="row">
					<Table className="table-hover">
						<thead>
							<tr>
								<th>Full Name</th>
								<th>Designation</th>
								<th>Contact</th>
								<th>Organization</th>
								<th>Organization Address</th>
								<th>Email</th>
								<th colSpan="3">Status</th>
							</tr>
						</thead>
						<tbody>{participants}</tbody>
					</Table>
				</div>

				<Modal isOpen={this.state.editParticipantModal} toggle={this.toggleEditParticipantModal.bind(this)}>
					<ModalHeader toggle={this.toggleEditParticipantModal.bind(this)}>
						Update Participant Form
					</ModalHeader>
					<ModalBody>
						<Form>
							<Input type="hidden" value={this.state.editParticipant.userId} />
							<FormGroup>
								<Label for="fullname">Full Name</Label>
								<Input
									type="text"
									name="fullname"
									id="fullname"
									value={this.state.editParticipant.fullname}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="designation">Designation</Label>
								<Input
									type="text"
									name="designation"
									id="designation"
									value={this.state.editParticipant.designation}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="contact">Cotact</Label>
								<Input
									type="text"
									name="contact"
									id="contact"
									value={this.state.editParticipant.contact}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="organization">Organization</Label>
								<Input
									type="text"
									name="organization"
									id="organization"
									value={this.state.editParticipant.organization}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="org_address">Organization Address</Label>
								<Input
									type="text"
									name="org_address"
									id="org_address"
									value={this.state.editParticipant.org_address}
									onChange={this.handleChange}
								/>
							</FormGroup>

							<FormGroup>
								<Label for="email">Email</Label>
								<Input
									type="text"
									name="email"
									id="email"
									value={this.state.editParticipant.email}
									onChange={this.handleChange}
								/>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={this.handleUpdate.bind(this)}>
							Update
						</Button>
						<Button color="secondary" onClick={this.toggleEditParticipantModal.bind(this)}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}
