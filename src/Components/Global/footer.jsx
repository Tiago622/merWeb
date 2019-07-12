import React, { Component } from "react";
import '../../CssComponents/footer.css'
class Footer extends Component {
  render() {
    return (
		<footer className="footer-distributed">

			{/*<div className="footer-right">

				<a ><i className="fa fa-facebook"></i></a>
				<a ><i className="fa fa-twitter"></i></a>
				<a ><i className="fa fa-linkedin"></i></a>
				<a ><i className="fa fa-github"></i></a>

			</div>
	*/}
			<div className="footer-left text-center">

				<p className="footer-links">
				<a href="/">Página Inicial</a> | <a href="/sobre">Sobre</a><br />
						<br/>
						</p>
				<p>MER &copy; 2019</p>
				
			</div>

		</footer>
      );
  }
}

export default Footer;
