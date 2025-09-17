// src/front/pages/Private.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Base URL del backend (definida en el .env del front como VITE_BACKEND_URL)
const API = import.meta.env.VITE_BACKEND_URL || "";

// Importante: asegúrate de tener importado el JS de Bootstrap en tu entry file
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

export const Private = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("Loading...");
    const token = localStorage.getItem("access_token");

    // Si no hay token, redirigimos a /login
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Llamada a /api/private con Bearer token
        const fetchPrivate = async () => {
            try {
                const resp = await fetch(`${API}/api/private`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await resp.json();

                if (!resp.ok) {
                    setMessage(data?.msg || "Unauthorized.");
                    return;
                }

                // Mensaje de confirmación si el token es válido
                setMessage(data?.msg || "You are authenticated.");
            } catch {
                setMessage("Network error.");
            }
        };

        fetchPrivate();
    }, [token, navigate]);

    // Confirmación de logout: borra token y vuelve a Home
    const confirmLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/");
    };

    if (!token) return null; // Protección extra (ya redirige el useEffect)

    return (
        <div className="min-vh-100 app-dark d-flex align-items-center">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card card-surface shadow-sm">
                            <div className="card-body p-4 text-center">
                                <h2 className="mb-3">This is a Private area</h2>
                                <p className="mb-4">{message}</p>

                                {/* Botón que abre el modal de confirmación */}
                                <button
                                    className="btn btn-cancel px-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#logoutModal"
                                >
                                    Log out
                                </button>

                                {/* Modal Bootstrap con el mismo tema de card */}
                                <div
                                    className="modal fade"
                                    id="logoutModal"
                                    tabIndex="-1"
                                    aria-labelledby="logoutModalLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content card-surface">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="logoutModalLabel">Confirm logout</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                You are about to log out. You will lose your access token and will need to log in again.
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-cancel"
                                                    data-bs-dismiss="modal"
                                                    onClick={confirmLogout}
                                                >
                                                    Confirm logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Fin modal */}
                            </div>
                        </div>
                        {/* Fin card */}
                    </div>
                </div>
            </div>
        </div>
    );
};
