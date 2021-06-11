import React, { Component } from 'react';
import {
	Table,
	Button,
	Label,
	Input,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Modal,
	FormGroup,
	Form,
	ListGroup,
	ListGroupItem
} from 'reactstrap';
import Axios from 'axios';
import swal from 'sweetalert';
import jwt from 'jwt-decode';

export default class ViewAgenda extends Component {
	constructor(props) {
		super(props);

		this.state = {
			sid: '',
			agenda_id: '',
			decision_id: '',
			agenda_title: '',
			agenda_description: '',
			decision: '',
			participants: [],
			participant_id: '',
			agenda: [],
			decisions: [],
			attendees: [],
			attendee: '',
			fullname: '',
			designation: '',
			present_status: '',
			isAdmin: false,
			config: {
				headers: { Authorization: localStorage.getItem('token') }
			},
			addPartModal: false,
			agendaModal: false,
			isUpdate: false,
			decisionModal: false,
			isDesUpdate: false,
			editPartModal: false
		};
	}

	handleChange = (e) =>
		this.setState(
			{
				[e.target.name]: e.target.value
			},
			() => {
				if (this.state.agenda_title === '' && this.state.agenda_description === '') {
					this.setState({ isUpdate: false });
				}
			}
		);

	componentDidMount() {
		//check admin
		let bearerToken = localStorage.getItem('token');
		let user = jwt(bearerToken.split(' ')[1]);
		if (user.role === 'admin') this.setState({ isAdmin: true });
		else this.setState({ isAdmin: false });
		console.log(this.state.isAdmin);

		//getting id from url
		let sid = this.props.match.params.sid;
		this.setState({ sid: sid });
		console.log(sid);

		Axios.get(`http://localhost:3001/api/participants`, this.state.config)
			.then((res) => {
				this.setState({
					participants: res.data
				});
			})
			.catch((err) => console.log(err.response));

		Axios.get(`http://localhost:3001/api/schedule/${sid}/attendees`, this.state.config)
			.then((res) => {
				this.setState(
					{
						attendees: res.data
					},
					() => console.log(res.data)
				);
			})
			.catch((err) => console.log(err.response));

		Axios.get(`http://localhost:3001/api/schedule/${sid}/agenda`, this.state.config)
			.then((res) => {
				this.setState({
					agenda: res.data
				});
				console.log(res.data);
			})
			.catch((err) => console.log(err.response));

		Axios.get(`http://localhost:3001/api/schedule/${sid}/decision`, this.state.config)
			.then((res) => {
				this.setState({
					decisions: res.data
				});
				console.log(res.data);
			})
			.catch((err) => console.log(err.response));
	}

	addAttenBtn() {
		this.setState({
			addPartModal: !this.state.addPartModal
		});
	}
	toggleAddPartModal() {
		this.setState({
			participant: '',
			addPartModal: !this.state.addPartModal
		});
	}
	handleAddAttendee() {
		Axios.post(
			`http://localhost:3001/api/schedule/${this.state.sid}/attendees`,
			{ participants: this.state.participant_id },
			this.state.config
		)
			.then((res) => {
				this.componentDidMount();
				console.log(res);

				this.setState({
					participant_id: '',
					addPartModal: !this.state.addPartModal
				});
			})
			.catch((err) => console.log(err.response));
	}

	addagendaBtn() {
		this.setState({
			agendaModal: !this.state.agendaModal
		});
	}
	toggleAgendaModal() {
		this.setState({
			agenda_title: '',
			agenda_description: '',
			agendaModal: !this.state.agendaModal,
			isUpdate: false
		});
	}
	editAttend(pid, p_staus) {
		this.setState({
			participant_id: pid,
			present_status: p_staus,
			editPartModal: !this.state.editPartModal
		});
	}
	toggleEditPartModal() {
		this.setState({
			present_status: '',
			editPartModal: !this.state.editPartModal
		});
	}

	handleEditAttendee() {
		Axios.put(
			`http://localhost:3001/api/schedule/${this.state.sid}/attendees/${this.state.participant_id}`,
			{ present_status: this.state.present_status },
			this.state.config
		)
			.then((res) => {
				this.componentDidMount();
				console.log(res);

				this.setState({
					present_status: '',
					editPartModal: !this.state.editPartModal
				});
			})
			.catch((err) => console.log(err.response));
	}

	deletePart(pid) {
		swal({
			title: 'Are you sure want to delete?',
			text: 'Once deleted, you will not be able to recover!',
			icon: 'warning',
			buttons: true,
			dangerMode: true
		}).then((willDelete) => {
			if (willDelete) {
				Axios.delete(`http://localhost:3001/api/schedule/${this.state.sid}/attendees/${pid}`, this.state.config)
					.then((res) => {
						console.log(res.data);
						this.componentDidMount();
						// const filteredAgenda = this.state.agenda.filter((agenda) => {
						// 	return agenda._id !== this.state.agenda_id;
						// });
						// this.setState({
						// 	agenda: filteredAgenda
						// });
					})
					.catch((err) => console.log(err.response));

				swal('Participant has been deleted!', {
					icon: 'success'
				});
			} else {
				swal('Your participant is safe!');
			}
		});
	}

	handleAgendaSubmit = (e) => {
		e.preventDefault();
		if (this.state.agenda_title === '' && this.state.agenda_description === '') return;
		if (this.state.isUpdate === false) {
			Axios.post(
				`http://localhost:3001/api/schedule/${this.state.sid}/agenda`,
				{ agenda_title: this.state.agenda_title, agenda_description: this.state.agenda_description },
				this.state.config
			)
				.then((res) => {
					this.componentDidMount();
					console.log(res);

					this.setState({
						//agenda: [ ...this.state.agenda, res.data ],
						agenda_title: '',
						agenda_description: '',
						agendaModal: !this.state.agendaModal
					});
				})
				.catch((err) => console.log(err.response));
		} else {
			Axios.put(
				`http://localhost:3001/api/schedule/${this.state.sid}/agenda/${this.state.agenda_id}`,
				{ agenda_title: this.state.agenda_title, agenda_description: this.state.agenda_description },
				this.state.config
			)
				.then((res) => {
					console.log(res);
					const updatedAgenda = this.state.agenda.map((agda) => {
						if (agda._id === this.state.agenda_id) {
							agda.agenda_title = this.state.agenda_title;
							agda.agenda_description = this.state.agenda_description;
						}
						return agda;
					});
					this.setState({
						isUpdate: false,
						agenda: updatedAgenda,
						agenda_title: '',
						agenda_description: '',
						agendaModal: !this.state.agendaModal
					});
				})
				.catch((err) => console.log(err.response));
		}
	};
	editAgenda(agenda_id, agenda_title, agenda_description) {
		this.setState({
			agenda_id: agenda_id,
			agenda_title: agenda_title,
			agenda_description: agenda_description,
			agendaModal: !this.state.agendaModal,
			isUpdate: true
		});
	}
	deleteAgenda(agenda_id) {
		swal({
			title: 'Are you sure want to delete?',
			text: 'Once deleted, you will not be able to recover!',
			icon: 'warning',
			buttons: true,
			dangerMode: true
		}).then((willDelete) => {
			if (willDelete) {
				Axios.delete(
					`http://localhost:3001/api/schedule/${this.state.sid}/agenda/${agenda_id}`,
					this.state.config
				)
					.then((res) => {
						console.log(res.data);
						this.componentDidMount();
						// const filteredAgenda = this.state.agenda.filter((agenda) => {
						// 	return agenda._id !== this.state.agenda_id;
						// });
						// this.setState({
						// 	agenda: filteredAgenda
						// });
					})
					.catch((err) => console.log(err.response));

				swal('Participant has been deleted!', {
					icon: 'success'
				});
			} else {
				swal('Your participant is safe!');
			}
		});
	}

	decisionEdit(did, decision) {
		this.setState({
			decision_id: did,
			decision: decision,
			decisionModal: !this.state.decisionModal,
			isDesUpdate: true
		});
	}
	toggleDecisionModal() {
		this.setState({
			decision: '',
			decisionModal: !this.state.decisionModal
		});
	}
	addDecisionBtn() {
		this.setState({
			decisionModal: !this.state.decisionModal
		});
	}

	handleDecisionSubmit = (e) => {
		e.preventDefault();
		if (this.state.decision === '') return;
		if (this.state.isDesUpdate === false) {
			Axios.post(
				`http://localhost:3001/api/schedule/${this.state.sid}/decision`,
				{ decision: this.state.decision },
				this.state.config
			)
				.then((res) => {
					this.componentDidMount();
					console.log(res);

					this.setState({
						decision: '',
						decisionModal: !this.state.decisionModal
					});
				})
				.catch((err) => console.log(err.response));
		} else {
			Axios.put(
				`http://localhost:3001/api/schedule/${this.state.sid}/decision/${this.state.decision_id}`,
				{ decision: this.state.decision },
				this.state.config
			)
				.then((res) => {
					console.log(res);
					const updatedDecision = this.state.decisions.map((decision) => {
						if (decision._id === this.state.decision_id) {
							decision.decision = this.state.decision;
						}
						return decision;
					});
					this.setState({
						isUpdate: false,
						decisions: updatedDecision,
						decision: '',
						decisionModal: !this.state.decisionModal
					});
				})
				.catch((err) => console.log(err.response));
		}
	};

	handleDecisionDelete(des_id) {
		swal({
			title: 'Are you sure want to delete?',
			text: 'Once deleted, you will not be able to recover!',
			icon: 'warning',
			buttons: true,
			dangerMode: true
		}).then((willDelete) => {
			if (willDelete) {
				Axios.delete(
					`http://localhost:3001/api/schedule/${this.state.sid}/decision/${des_id}`,
					this.state.config
				)
					.then((res) => {
						this.componentDidMount();
						console.log(res.data);
					})
					.catch((err) => console.log(err.response));

				swal('Decision has been deleted!', {
					icon: 'success'
				});
			} else {
				swal('Decision is safe!');
			}
		});
	}

	render() {
		let part = this.state.attendees.map((att) => {
			return (
				<tr key={att._id}>
					<td>{att.participants.fullname}</td>
					<td>{att.participants.designation}</td>
					<td>{att.participants.organization}</td>
					<td>{att.present_status}</td>
					<td>
						<Button
							size="sm"
							color="primary"
							onClick={this.editAttend.bind(this, att._id, att.present_status)}
						>
							EDIT
						</Button>
					</td>

					<td>
						{this.state.isAdmin ? (
							<Button size="sm" color="danger" onClick={() => this.deletePart(att._id)}>
								Delete
							</Button>
						) : (
							<span />
						)}
					</td>
				</tr>
			);
		});

		let ag = this.state.agenda.map((agd) => {
			return (
				<tr key={agd._id}>
					<td>{agd.agenda_title}</td>
					<td>{agd.agenda_description}</td>

					<td>
						<Button
							size="sm"
							color="primary"
							onClick={this.editAgenda.bind(this, agd._id, agd.agenda_title, agd.agenda_description)}
						>
							EDIT
						</Button>
					</td>

					<td>
						{this.state.isAdmin ? (
							<Button size="sm" color="danger" onClick={() => this.deleteAgenda(agd._id)}>
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
			<div className="">
				<div className="title">
					<div className="float-left">
						<h1>Attendees:</h1>
					</div>

					<div className="float-right">
						<Button color="success" onClick={this.addAttenBtn.bind(this)}>
							ADD
						</Button>
					</div>
				</div>
				<div>
					<div className="row">
						<Table className="table-hover">
							<thead>
								<tr>
									<th>Participant Name</th>
									<th>Designation</th>
									<th>Organization</th>
									<th>Present Status</th>
									<th colSpan="2">Status</th>
								</tr>
							</thead>
							<tbody>{part}</tbody>
						</Table>
					</div>
				</div>

				<Modal isOpen={this.state.addPartModal} toggle={this.toggleAddPartModal.bind(this)}>
					<ModalHeader toggle={this.toggleAddPartModal.bind(this)}>Update Schedule Form</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label for="participant">Participant</Label>

								<Input
									type="select"
									name="participant_id"
									id="participant_id"
									value={this.state.participant_id}
									onChange={this.handleChange}
								>
									<option value="">Select Participant</option>
									{this.state.participants.map((participants) => {
										return (
											<option value={participants._id} key={participants._id}>
												{participants.fullname}
											</option>
										);
									})}
								</Input>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={this.handleAddAttendee.bind(this)}>
							Add
						</Button>
						<Button color="secondary" onClick={this.toggleAddPartModal.bind(this)}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={this.state.editPartModal} toggle={this.toggleEditPartModal.bind(this)}>
					<ModalHeader toggle={this.toggleEditPartModal.bind(this)}>Update Status</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label for="present_status">Status</Label>
								<Input
									type="text"
									name="present_status"
									id="present_status"
									value={this.state.present_status}
									onChange={this.handleChange}
								/>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button color="warning" onClick={this.handleEditAttendee.bind(this)}>
							Update
						</Button>
						<Button color="secondary" onClick={this.toggleEditPartModal.bind(this)}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>

				<hr />
				<hr />

				<div className="title">
					<div className="float-left">
						<h1>Agenda:</h1>
					</div>

					<div className="float-right">
						<Button color="success" onClick={this.addagendaBtn.bind(this)}>
							ADD
						</Button>
					</div>
				</div>
				<div className="row">
					<div>
						<Table className="table-hover">
							<thead>
								<tr>
									<th>Agenda Title</th>
									<th>Agenda Description</th>
									<th colSpan="3">Status</th>
								</tr>
							</thead>
							<tbody>{ag}</tbody>
						</Table>
					</div>

					<Modal isOpen={this.state.agendaModal} toggle={this.toggleAgendaModal.bind(this)}>
						<ModalHeader toggle={this.toggleAgendaModal.bind(this)}>Update Schedule Form</ModalHeader>
						<ModalBody>
							<Form>
								<FormGroup>
									<Label for="agenda_title">Agenda Title</Label>
									<Input
										type="text"
										name="agenda_title"
										id="agenda_title"
										value={this.state.agenda_title}
										onChange={this.handleChange}
									/>
								</FormGroup>
								<FormGroup>
									<Label for="agenda_description">Agenda Description</Label>
									<Input
										type="text"
										name="agenda_description"
										id="agenda_description"
										value={this.state.agenda_description}
										onChange={this.handleChange}
									/>
								</FormGroup>
							</Form>
						</ModalBody>
						<ModalFooter>
							{this.state.isUpdate ? (
								<Button color="warning" onClick={this.handleAgendaSubmit.bind(this)}>
									Update
								</Button>
							) : (
								<Button color="primary" onClick={this.handleAgendaSubmit.bind(this)}>
									Add
								</Button>
							)}

							<Button color="secondary" onClick={this.toggleAgendaModal.bind(this)}>
								Cancel
							</Button>
						</ModalFooter>
					</Modal>
				</div>

				<hr />
				<hr />

				<div className="title">
					<div className="float-left">
						<h1>Decision:</h1>
					</div>

					<div className="float-right">
						<Button color="success" onClick={this.addDecisionBtn.bind(this)}>
							ADD
						</Button>
					</div>
				</div>
				<div className="row">
					<div>
						<ListGroup>
							{this.state.decisions.map((decision) => {
								return (
									<ListGroupItem key={decision._id}>
										<span onClick={this.decisionEdit.bind(this, decision._id, decision.decision)}>
											{decision.decision}
										</span>
										<Button close onClick={this.handleDecisionDelete.bind(this, decision._id)} />
									</ListGroupItem>
								);
							})}
						</ListGroup>
					</div>

					<Modal isOpen={this.state.decisionModal} toggle={this.toggleDecisionModal.bind(this)}>
						<ModalHeader toggle={this.toggleDecisionModal.bind(this)}>Update Schedule Form</ModalHeader>
						<ModalBody>
							<Form>
								<FormGroup>
									<Label for="decision">Decision</Label>
									<Input
										type="text"
										name="decision"
										id="decision"
										value={this.state.decision}
										onChange={this.handleChange}
									/>
								</FormGroup>
							</Form>
						</ModalBody>
						<ModalFooter>
							{this.state.isDesUpdate ? (
								<Button color="warning" onClick={this.handleDecisionSubmit.bind(this)}>
									Update
								</Button>
							) : (
								<Button color="primary" onClick={this.handleDecisionSubmit.bind(this)}>
									Add
								</Button>
							)}

							<Button color="secondary" onClick={this.toggleDecisionModal.bind(this)}>
								Cancel
							</Button>
						</ModalFooter>
					</Modal>
				</div>
			</div>
		);
	}
}
