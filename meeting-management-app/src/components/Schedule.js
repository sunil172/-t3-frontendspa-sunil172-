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
	CustomInput
} from 'reactstrap';
import Axios from 'axios';
import swal from 'sweetalert';
import '../assets/myStyle.css';
import jwt from 'jwt-decode';

export default class Schedule extends Component {
	constructor(props) {
		super(props);

		this.state = {
			schedule_id: '',
			meeting_title: '',
			meeting_desc: '',
			date: '',
			time: '',
			venue: '',
			completed: Boolean,
			schedules: [],
			isEdit: false,
			isScheduled: false,
			isAdmin: false,
			config: {
				headers: { Authorization: localStorage.getItem('token') }
			},
			editschedulesModal: false,
			editschedules: {
				schedule_id: '',
				meeting_title: '',
				meeting_desc: '',
				date: '',
				time: '',
				venue: '',
				completed: Boolean
			}
		};
	}

	handleChange = (e) =>
		this.setState(
			{
				editschedules: { ...this.state.editschedules, [e.target.name]: e.target.value }
			},
			() => console.log(this.state.editschedules)
		);

	componentDidMount() {
		let bearerToken = localStorage.getItem('token');
		let user = jwt(bearerToken.split(' ')[1]);
		if (user.role === 'admin') this.setState({ isAdmin: true });
		else this.setState({ isAdmin: false });
		console.log(this.state.isAdmin);

		Axios.get('http://localhost:3001/api/schedule', this.state.config)
			.then((res) => {
				//console.log(res.data);
				this.setState({
					schedules: res.data
				});
			})
			.catch((err) => console.log(err.response));
	}
	addschedules() {
		window.location.href = '/dash/addSchedule';
	}

	deleteSchedule = (schedules_id) => {
		swal({
			title: 'Are you sure want to delete?',
			text: 'Once deleted, you will not be able to recover!',
			icon: 'warning',
			buttons: true,
			dangerMode: true
		}).then((willDelete) => {
			if (willDelete) {
				const filteredSchedule = this.state.schedules.filter((schedules) => {
					return schedules._id !== schedules_id;
				});
				Axios.delete(`http://localhost:3001/api/schedule/${schedules_id}`, this.state.config)
					.then((res) => {
						console.log(res.data);
						this.setState({
							schedules: filteredSchedule
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

	handleClick(schedule_id) {
		window.location.href = `/dash/viewAgenda/${schedule_id}`;
	}

	toggleEditScheduleModal() {
		this.setState({
			editschedulesModal: !this.state.editschedulesModal
		});
	}

	editschedule = (schedule_id, meeting_title, meeting_desc, date, time, venue, completed) => {
		this.setState(
			{
				editschedules: { schedule_id, meeting_title, meeting_desc, date, time, venue, completed },
				editschedulesModal: !this.state.editschedulesModal
			},
			() => console.log(this.state.editParticipant)
		);
	};

	handleUpdate() {
		let { schedule_id, meeting_title, meeting_desc, date, time, venue, completed } = this.state.editschedules;

		Axios.put(
			`http://localhost:3001/api/schedule/${this.state.editschedules.schedule_id}`,
			{ schedule_id, meeting_title, meeting_desc, date, time, venue, completed },
			this.state.config
		).then((res) => {
			this.componentDidMount();

			this.setState({
				editschedulesModal: false,
				editschedules: {
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
		let scheduless = this.state.schedules.map((schedules) => {
			return (
				<tr key={schedules._id}>
					<td onClick={() => this.handleClick(schedules._id)}>{schedules.meeting_title}</td>
					<td onClick={() => this.handleClick(schedules._id)}>{schedules.meeting_desc}</td>
					<td onClick={() => this.handleClick(schedules._id)}>{schedules.date}</td>
					<td onClick={() => this.handleClick(schedules._id)}>{schedules.time}</td>
					<td onClick={() => this.handleClick(schedules._id)}>{schedules.venue}</td>

					<td>
						<Button
							size="sm"
							color="primary"
							onClick={this.editschedule.bind(
								this,
								schedules._id,
								schedules.meeting_title,
								schedules.meeting_desc,
								schedules.date,
								schedules.time,
								schedules.venue,
								schedules.completed
							)}
						>
							EDIT
						</Button>
					</td>

					<td>
						{this.state.isAdmin ? (
							<Button size="sm" color="danger" onClick={() => this.deleteSchedule(schedules._id)}>
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
			<div className="container jmt">
				<div className="title">
					<div className="float-left">
						<h1>Schedule List</h1>
					</div>

					<div className="float-right">
						<Button color="success" onClick={this.addschedules}>
							ADD
						</Button>
					</div>
				</div>
				<div className="row">
					<Table className="table-hover">
						<thead>
							<tr>
								<th>Meeting Title</th>
								<th>Meeting Description</th>
								<th>Date</th>
								<th>Time</th>
								<th>Venue</th>
								<th colSpan="3">Status</th>
							</tr>
						</thead>
						<tbody>{scheduless}</tbody>
					</Table>
				</div>
				<Modal isOpen={this.state.editschedulesModal} toggle={this.toggleEditScheduleModal.bind(this)}>
					<ModalHeader toggle={this.toggleEditScheduleModal.bind(this)}>Update Schedule Form</ModalHeader>
					<ModalBody>
						<Form>
							<Input type="hidden" value={this.state.editschedules.schedule_id} />
							<FormGroup>
								<Label for="meeting_title">Meeting Title</Label>
								<Input
									type="text"
									name="meeting_title"
									id="meeting_title"
									value={this.state.editschedules.meeting_title}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="meeting_desc">Meeting Description</Label>
								<Input
									type="text"
									name="meeting_desc"
									id="meeting_desc"
									value={this.state.editschedules.meeting_desc}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="date">Date</Label>
								<Input
									type="date"
									name="date"
									id="date"
									value={this.state.editschedules.date}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="time">Time</Label>
								<Input
									type="time"
									name="time"
									id="time"
									value={this.state.editschedules.time}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="contact">Venue</Label>
								<Input
									type="text"
									name="venue"
									id="venue"
									value={this.state.editschedules.venue}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<CustomInput
									name="completed"
									id="completed"
									type="switch"
									label="Is Done?"
									bsSize="lg"
									value={this.state.editschedules.completed}
									onChange={this.handleChange}
								/>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={this.handleUpdate.bind(this)}>
							Update
						</Button>
						<Button color="secondary" onClick={this.toggleEditScheduleModal.bind(this)}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}
