import React from 'react';
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

import { Navbar, NavItem, NavbarText, Nav, NavbarBrand } from 'reactstrap';
import { NavLink, Switch, Link } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Logout from '../Logout';
import Participant from '../Participant';
import Schedule from '../Schedule';
import EditSchedul from '../EditSchedule';
import EditParticipants from '../EditParticipants';
import '../../assets/myStyle.css';
import logout from '../Logout';
import AddParticipants from '../AddParticipants';
import AddSchedule from '../AddSchedule';
import ScheduleNav from './ScheduleNav';
import ViewAgenda from '../ViewAgenda';

export default function NavBar(props) {
	return (
		<div className="wrapper">
			<div className="mySidebar">
				<ProSidebar>
					<SidebarHeader>
						<center>
							<h2>Meeting Management System</h2>
						</center>
					</SidebarHeader>
					<SidebarContent>
						<Menu iconShape="square">
							<MenuItem>
								<label>Username</label>

								<Link to="/dash/profile" />
							</MenuItem>
							<MenuItem>
								<label>Participant</label>

								<Link to="/dash/participant" />
							</MenuItem>
							<MenuItem>
								<label>Schedule</label>
								<Link to="/dash/schedule" />
							</MenuItem>
							<MenuItem>
								<Logout />
							</MenuItem>
						</Menu>
					</SidebarContent>
				</ProSidebar>
			</div>

			<div className="container navContainer">
				<Switch>
					<PrivateRoute path="/dash/participant" component={Participant} />
					<PrivateRoute path="/dash/addParticipant" component={AddParticipants} />
					<PrivateRoute path="/dash/schedule" component={Schedule} />
					<PrivateRoute path="/dash/addSchedule" component={AddSchedule} />
					<PrivateRoute path="/dash/veiwSchedule" component={ScheduleNav} />
					<PrivateRoute path="/dash/schedule/:scheduleId" component={EditSchedul} />
					<PrivateRoute path="/dash/viewAgenda/:sid" component={ViewAgenda} />
				</Switch>
			</div>
		</div>
	);
}
