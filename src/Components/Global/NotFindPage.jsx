import React, { Component } from "react";
import '../../CssComponents/notFindPage.css';
class NotFindPage extends Component {
	render() {
		return (
			<div className="wrap">
				<div className="logo">
					<h1>404</h1>
					<p> Sorry - File not Found!</p>
					<div className="sub">
						<p><a href="/"> Back to Home</a></p>
					</div>
				</div>
			</div>

		);
	}
}

export default NotFindPage;