import "../App.css"; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar/Navbar";

const JerarquiaUsuarios = () => {
    const [jerarquia, setJerarquia] = useState({
        Administrador: [],
        Colaborador: [],
        Cliente: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJerarquia = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/usuarios/jerarquia");
                setJerarquia(response.data);
            } catch (err) {
                setError("Error al obtener los usuarios.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJerarquia();
    }, []);

    const obtenerTituloRol = (rol) => {
        switch (rol) {
            case "Administrador":
                return "Administradores";
            case "Colaborador":
                return "Colaboradores";
            case "Cliente":
                return "Clientes";
            default:
                return rol;
        }
    };

    return (
        <div>
            <Navbar />
            <Container className="mt-4 kreativa-container">
                <h2 className="text-center kreativa-title">Jerarquía de Usuarios</h2>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" className="kreativa-spinner" />
                        <p className="loading-text">Cargando usuarios...</p>
                    </div>
                ) : error ? (
                    <p className="text-danger text-center kreativa-error">{error}</p>
                ) : (
                    <Row className="jerarquia-section">
                        {Object.entries(jerarquia).map(([rol, usuarios]) => (
                            <Col key={rol} md={4} className="jerarquia-col">
                                <h4 className={`jerarquia-title kreativa-${rol.toLowerCase()}`}>{obtenerTituloRol(rol)}</h4>
                                {usuarios.length > 0 ? (
                                    usuarios.map((usuario) => (
                                        <Card key={usuario._id} className="mb-3 kreativa-card animate-box">
                                            <Card.Body>
                                                <Card.Title className="kreativa-card-title">{usuario.nombre}</Card.Title>
                                                <Card.Text className="kreativa-card-text">Email: {usuario.email}</Card.Text>
                                                <Card.Text className="kreativa-card-text">Tipo de Usuario: {obtenerTituloRol(rol)}</Card.Text>
                                                <Card.Text className="kreativa-card-text">Estado: {usuario.estado}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-center text-muted">No hay {obtenerTituloRol(rol).toLowerCase()}.</p>
                                )}
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
            
            <style>
                {`
                .kreativa-card {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
                    border: 2px solid #ff0072;
                }

                .kreativa-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 20px rgba(255, 0, 114, 0.3);
                    border-color: #ff0072;
                }

                .animate-box {
                    animation: fadeInUp 0.5s ease-in-out;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>
        </div>
    );
};

export default JerarquiaUsuarios;
