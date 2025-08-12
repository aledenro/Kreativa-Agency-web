import React, { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import ListadoServicios from "./ListadoServicios";
import FormContacto from "./FormContacto";
import FormReclutaciones from "./FormReclutaciones";
import Particles from "../components/ui/Particles";
import Footer from "../components/Navbar/Footer";
import { ElfsightWidget } from "react-elfsight-widget";

const Landing = () => {
    return (
        <div>
            <Navbar></Navbar>
            <section id="landing">
                <div className="landing-container">
                    <div className="video-section">
                        <video className="video-background" autoPlay loop muted>
                            <source
                                src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/landing-video.mov"
                                type="video/mp4"
                            />
                        </video>
                        <div className="video-overlay"></div>
                        <div className="video-content">
                            <img
                                src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/logo.png"
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
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <img
                    src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/img/25.svg"
                    alt="decoración"
                    className="doodle-landing"
                />
            </div>
            <section id="contacto">
                <FormContacto></FormContacto>
            </section>
            <section className="particles">
                <div
                    style={{
                        width: "100%",
                        minHeight: "600px",
                        position: "relative",
                        padding: "40px 20px",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: 1,
                        }}
                    >
                        <Particles
                            particleColors={["#ffffff", "#ffffff"]}
                            particleCount={500}
                            particleSpread={10}
                            speed={0.1}
                            particleBaseSize={100}
                            moveParticlesOnHover={true}
                            alphaParticles={false}
                            disableRotation={false}
                        />
                    </div>
                    {/* intagram widget */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 10,
                            maxWidth: "1200px",
                            margin: "0 auto",
                        }}
                    >
                        <ElfsightWidget widgetId="4a5ab791-4df7-419d-ba32-87785ef9ba1c" />
                    </div>
                </div>
            </section>
            <section id="reclutaciones">
                <FormReclutaciones></FormReclutaciones>
            </section>
            <Footer />
        </div>
    );
};

export default Landing;
