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
                  src={servicio.imagenMostrar}
                  alt={servicio.nombre}
                  className="embla__slide__image"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400";
                  }}
                />
                <div className="embla__slide__overlay">
                  <div className="embla__slide__overlay-row">
                    <h3 className="embla__slide__title">{servicio.nombre}</h3>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="arrow-icon"
                      onClick={() => onClickServicio(servicio._id)}
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
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
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
          `${import.meta.env.VITE_API_URL}/servicios/`
        );

        if (Array.isArray(response.data)) {
          const serviciosActivos = response.data
            .filter((servicio) => servicio.activo === true)
            .map((servicio) => {
              let imagenMostrar = "https://placehold.co/600x400";

              if (servicio.imagenes && servicio.imagenes.length > 0) {
                imagenMostrar = servicio.imagenes[servicio.imagenes.length - 1];
              } else if (servicio.imagen) {
                imagenMostrar = servicio.imagen;
              }

              return {
                ...servicio,
                imagenMostrar,
              };
            });

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
      <div className="container">
        <div className="services-header">
          <div className="service-title">
            <h2 className="main-heading">Nuestros Servicios</h2>
            <p className="subtitle">
              Soluciones diseñadas para impulsar tu negocio
            </p>
            {/* <p>
              {rol === "Administrador" && (
                <button
                  className="thm-btn"
                  onClick={() => handleAgregarServicio()}
                >
                  Nuevo Servicio
                </button>
              )}
            </p> */}
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
                    onClick={() => handleListadoServicios(servicio._id)}
                  >
                    {servicio.nombre}
                  </a>
                  {index < servicios.length - 1 && (
                    <span className="nav-separator">&#9679;</span>
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
      </div>
    </div>
  );
};

export default ListadoServicios;
