// src/front/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Base URL del backend (definida en el .env del front como VITE_BACKEND_URL)
const API = import.meta.env.VITE_BACKEND_URL || "";

export const Signup = () => {
    // Estado local para registro
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Errores de la API o de red
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Enviar datos a /api/signup en el backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const resp = await fetch(`${API}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await resp.json();

            if (!resp.ok) {
                setError(data?.msg || "Signup failed.");
                return;
            }

            // Signup devuelve token para entrar directo a /private
            localStorage.setItem("access_token", data.access_token);

            // Navegamos a la vista privada
            navigate("/private");
        } catch {
            setError("Network error.");
        }
    };

    return (
        <div className="min-vh-100 app-dark d-flex align-items-center">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-5">
                        <div className="card card-surface shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="mb-3 text-center">Sign up</h2>

                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control input-dark"
                                            placeholder="yourown@madeupemail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control input-dark"
                                            placeholder="Your password will be encrypted in the database."
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Botón aceptar (verde sobrio) */}
                                    <button type="submit" className="btn btn-accept w-100">
                                        Create account
                                    </button>
                                </form>

                                <div className="text-center mt-3">
                                    <small>
                                        Already have an account? <Link to="/login">Log in</Link>
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
