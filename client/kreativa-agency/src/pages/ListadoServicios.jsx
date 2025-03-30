import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
    DotButton,
    useDotButton,
} from "../components/ui/EmblaCarouselDotButton";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from "../components/ui/EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";

const EmblaCarousel = (props) => {
    const { servicios, options, onClickServicio } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {servicios.map((servicio) => (
                        <div className="embla__slide" key={servicio._id}>
                            <div className="embla__slide__content">
                                <img
                                    src={servicio.imagen}
                                    alt={servicio.nombre}
                                    className="embla__slide__image"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://placehold.co/600x400";
                                    }}
                                />
                                <div className="embla__slide__overlay">
                                    <div className="embla__slide__overlay-row">
                                        <h3 className="embla__slide__title">
                                            {servicio.nombre}
                                        </h3>
                                        <FontAwesomeIcon
                                            icon={faArrowRight}
                                            className="arrow-icon"
                                            onClick={() =>
                                                onClickServicio(servicio._id)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                    />
                    <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                    />
                </div>

                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={"embla__dot".concat(
                                index === selectedIndex
                                    ? " embla__dot--selected"
                                    : ""
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ListadoServicios = () => {
    const [servicios, setServicios] = useState([]);
    const navigate = useNavigate();
    const rol = localStorage.getItem("tipo_usuario");

    useEffect(() => {
        async function getServicios() {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/servicios/"
                );

                if (Array.isArray(response.data)) {
                    const serviciosActivos = response.data.map((servicio) => ({
                        ...servicio,
                        imagen:
                            servicio.imagen || "https://placehold.co/600x400",
                    }));

                    setServicios(serviciosActivos);
                } else {
                    setServicios([]);
                }
            } catch (error) {
                console.error("Error obteniendo servicios:", error.message);
                setServicios([]);
            }
        }

        getServicios();
    }, []);

    function handleListadoServicios(id) {
        navigate(`/servicio/${id}`);
    }

    function handleAgregarServicio() {
        navigate(`/servicio/agregar`);
    }

    // Carousel options
    const OPTIONS = { loop: true, dragFree: true };

    return (
        <div className="services-page">
            <div className="container main-container">
                <div className="services-header">
                    <div className="service-title">
                        <h2 className="main-heading">Nuestros Servicios</h2>
                        <p className="subtitle">
                            Soluciones diseñadas para impulsar tu negocio
                        </p>
                        <p>
                            {rol === "Administrador" && (
                                <button
                                    className="thm-btn"
                                    onClick={() => handleAgregarServicio()}
                                >
                                    Nuevo Servicio
                                </button>
                            )}
                        </p>
                    </div>
                </div>

                {servicios.length > 0 && (
                    <div className="services-nav">
                        <p className="fw-bold">
                            {servicios.map((servicio, index) => (
                                <React.Fragment key={servicio._id}>
                                    <a
                                        href={`#servicio-${servicio._id}`}
                                        className="service-nav-link"
                                        onClick={() =>
                                            handleListadoServicios(servicio._id)
                                        }
                                    >
                                        {servicio.nombre}
                                    </a>
                                    {index < servicios.length - 1 && (
                                        <span className="nav-separator">
                                            &#9679;
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                )}

                {servicios.length > 0 && (
                    <EmblaCarousel
                        servicios={servicios}
                        options={OPTIONS}
                        onClickServicio={handleListadoServicios}
                    />
                )}

                {/* <section className="services">
                    <div className="services-container">
                        {servicios.length > 0 ? (
                            servicios.map((servicio, index) => (
                                <div
                                    key={servicio._id}
                                    id={`servicio-${servicio._id}`}
                                    className={`service-card ${index % 2 !== 0 ? "reverse" : ""}`}
                                >
                                    <div className="service-image-container">
                                        <img
                                            src={servicio.imagen}
                                            alt={servicio.nombre}
                                            className="service-image"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://placehold.co/600x400";
                                            }}
                                        />
                                    </div>
                                    <div className="service-content">
                                        <div>
                                            <h3 className="services-title">
                                                <a
                                                    onClick={() =>
                                                        handleListadoServicios(
                                                            servicio._id
                                                        )
                                                    }
                                                    className="service-title-link"
                                                >
                                                    {servicio.nombre}
                                                </a>
                                            </h3>
                                            <p className="service-description">
                                                {servicio.descripcion.length >
                                                100
                                                    ? servicio.descripcion.substring(
                                                          0,
                                                          100
                                                      ) + "..."
                                                    : servicio.descripcion}
                                            </p>
                                        </div>
                                        <button
                                            className="thm-btn thm-btn-small service-btn"
                                            onClick={() =>
                                                handleListadoServicios(
                                                    servicio._id
                                                )
                                            }
                                        >
                                            Ver más{" "}
                                            <FontAwesomeIcon
                                                icon={faArrowRight}
                                                className="btn-icon"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-services">
                                <p>No hay servicios por mostrar</p>
                            </div>
                        )}
                    </div>
                </section> */}
            </div>
        </div>
    );
};

export default ListadoServicios;
