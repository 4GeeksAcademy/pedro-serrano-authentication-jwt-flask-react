import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>
				<div className="dropdown">
					<button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						Click here
					</button>
					<ul className="dropdown-menu">
						<li><a className="dropdown-item" href="#">Log in</a></li>
						<li><a className="dropdown-item" href="#">Sign up</a></li>
						<li><a className="dropdown-item" href="#">Log out</a></li>
					</ul>
				</div>
			</div>
		</nav>
	);
};