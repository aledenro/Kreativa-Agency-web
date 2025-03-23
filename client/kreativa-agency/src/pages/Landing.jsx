import React from "react";
import video from "../assets/vid/landing-video.mov";
import Navbar from "../components/Navbar/Navbar";
import ListadoServicios from "./ListadoServicios";
import FormContacto from "./FormContacto";
import FormReclutaciones from "./FormReclutaciones";
import "animate.css";

const Landing = () => {
    return (
        <div>
            <Navbar></Navbar>
            <section id="landing">
                <div className="landing-container">
                    <div className="video-section">
                        <video className="video-background" autoPlay loop muted>
                            <source src={video} type="video/mp4" />
                        </video>
                        <div className="video-overlay"></div>
                        <div className="video-content">
                            <img
                                src="src/assets/img/logo.png"
                                alt="Logo"
                                className="video-logo"
                            />
                            <p className="video-text landing-h2">
                                Somos tu solución Kreativa
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="servicios">
                <ListadoServicios></ListadoServicios>
            </section>
            <section id="contacto">
                <FormContacto></FormContacto>
            </section>
            <section id="reclutaciones">
                <FormReclutaciones></FormReclutaciones>
            </section>
        </div>
    );
};

export default Landing;
