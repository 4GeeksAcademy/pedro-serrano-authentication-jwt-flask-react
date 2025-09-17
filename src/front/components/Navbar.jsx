import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


export const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Estado derivado de si existe token en localStorage
	const [hasToken, setHasToken] = useState(!!localStorage.getItem("access_token"));

	// Actualiza estado cuando cambias de ruta (por si hiciste login/signup)
	useEffect(() => {
		setHasToken(!!localStorage.getItem("access_token"));
	}, [location.pathname]);

	// Escucha cambios de token ocurridos en otras pestañas/ventanas
	useEffect(() => {
		const onStorage = () => setHasToken(!!localStorage.getItem("access_token"));
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	// Logout “stateless”: borrar token + redirigir (no requiere endpoint)
	const handleLogout = () => {
		localStorage.removeItem("access_token");
		setHasToken(false);
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
			<div className="container">
				<Link className="navbar-brand" to="/">JWT Authentication example project by Pedro Serrano Camblor</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navMain"
					aria-controls="navMain"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="navMain">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						
						{/* Enlace a Private visible solo si hay token */}
						{hasToken && (
							<li className="nav-item">
								<Link className="nav-link" to="/private">Private</Link>
							</li>
						)}
					</ul>

					<div className="d-flex gap-2">
						{!hasToken ? (
							<>
								{/* Sin token: mostrar Log in / Sign up */}
								<Link to="/login" className="btn btn-accept">Log in</Link>
								<Link to="/signup" className="btn btn-secondary">Sign up</Link>
							</>
						) : (
							// Con token: mostrar Log out
							<button className="btn btn-cancel" onClick={handleLogout}>
								Log out
							</button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
