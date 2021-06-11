import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Axios from 'axios';

export default class AddSchedule extends Component {
	constructor(props) {
		super(props);

		this.state = {
			meeting_title: '',
			meeting_desc: '',
			date: '',
			time: '',
			venue: '',
			config: {
				headers: { Authorization: localStorage.getItem('token') }
			}
		};
	}

	handleChange = (e) =>
		this.setState({
			[e.target.name]: e.target.value
		});

	handleCancel() {
		window.location.href = '/dash/schedule';
	}

	handleSubmit = (e) => {
		e.preventDefault();
		Axios.post(
			'http://localhost:3001/api/schedule',
			{
				meeting_title: this.state.meeting_title,
				meeting_desc: this.state.meeting_desc,
				date: this.state.date,
				time: this.state.time,
				venue: this.state.venue
			},
			this.state.config
		)
			.then((res) => {
				console.log(res);
				window.location.href = '/dash/schedule';
			})
			.catch((err) => console.log(err));
	};

	render() {
		return (
			<div>
				<div>
					<div className="title">
						<div className="float-left">
							<h1>Add Schedule Form</h1>
						</div>
					</div>
					<center>
						<Form className="w-50">
							<FormGroup>
								<Label for="meeting_title">Meeting Title</Label>
								<Input
									type="text"
									name="meeting_title"
									id="meeting_title"
									placeholder="Enter meeting title"
									value={this.state.meeting_title}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="meeting_desc">Meeting Description</Label>
								<Input
									type="text"
									name="meeting_desc"
									id="meeting_desc"
									placeholder="Enter meeting description"
									value={this.state.meeting_desc}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="date">Date</Label>
								<Input
									type="date"
									name="date"
									id="date"
									placeholder="Enter schedule date"
									value={this.state.date}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="time">Time</Label>
								<Input
									type="time"
									name="time"
									id="time"
									placeholder="Enter schedule time"
									value={this.state.time}
									onChange={this.handleChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="contact">Venue</Label>
								<Input
									type="text"
									name="venue"
									id="venue"
									placeholder="Enter meeting venue"
									value={this.state.venue}
									onChange={this.handleChange}
								/>
							</FormGroup>

							<Button color="primary" block onClick={this.handleSubmit}>
								Add Schedule
							</Button>
							<Button color="secondary" block onClick={this.handleCancel}>
								Cancel
							</Button>
						</Form>
					</center>
				</div>
			</div>
		);
	}
}
