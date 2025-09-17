// src/front/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Base URL del backend (definida en el .env del front como VITE_BACKEND_URL)
const API = import.meta.env.VITE_BACKEND_URL || "";

export const Login = () => {
    // Estado local para campos del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Estado para mostrar errores de la API o de red
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Enviar credenciales a /api/login en el backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const resp = await fetch(`${API}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await resp.json();

            if (!resp.ok) {
                // Mensaje de error del backend (401, 400, etc.)
                setError(data?.msg || "Login failed.");
                return;
            }

            // Guardamos el token para este ejercicio académico
            localStorage.setItem("access_token", data.access_token);

            // Vamos a la vista privada
            navigate("/private");
        } catch {
            setError("Network error.");
        }
    };

    return (
        // Envoltorio a pantalla completa con tema oscuro
        <div className="min-vh-100 bg-dark text-light d-flex align-items-center">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-5">
                        {/* Card adaptada a tema oscuro */}
                        <div className="card bg-secondary-subtle border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="mb-3 text-center text-dark">Log in</h2>

                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-dark">Email</label>
                                        <input
                                            type="email"
                                            className="form-control bg-dark text-light border-secondary"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-dark">Password</label>
                                        <input
                                            type="password"
                                            className="form-control bg-dark text-light border-secondary"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Botón bien contrastado (usa tu color sobrio de aceptar) */}
                                    <button type="submit" className="btn btn-accept w-100">
                                        Log in
                                    </button>
                                </form>

                                <div className="text-center mt-3">
                                    <small className="text-dark">
                                        Don’t have an account? <Link to="/signup">Sign up</Link>
                                    </small>
                                </div>
                            </div>
                        </div>
                        {/* Fin card */}
                    </div>
                </div>
            </div>
        </div>
    );
};
