// src/front/pages/Home.jsx
import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
	const { store } = useGlobalReducer();

	return (
		<div className="min-vh-100 app-dark d-flex align-items-center">
			<div className="container py-5">
				<div className="row justify-content-center">
					<div className="col-12 col-md-8 col-lg-6">
						{/* Card con tema oscuro */}
						<div className="card card-surface shadow-sm text-center">
							<div className="card-body p-4">
								<h1 className="display-5 mb-3">Hello there!</h1>
								<h5 className="mb-4">
									This exercise demonstrates how to implement a JWT authentication system using React JS and Flask. Use the navigation bar to move through the app.
								</h5>
								<p>Created with &#10084; by Pedro Serrano Camblor</p>

								{/* Solo mostramos el mensaje si existe */}
								{store.message && (
									<div className="alert alert-info">{store.message}</div>
								)}
							</div>
						</div>
						{/* Fin card */}
					</div>
				</div>
			</div>
		</div>
	);
};
