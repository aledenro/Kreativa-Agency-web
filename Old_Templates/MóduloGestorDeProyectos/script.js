document.addEventListener("DOMContentLoaded", () => {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  } else {
    console.error(
      "particles.js no está definido. Verifique si se cargó correctamente."
    );
  }
});

const links = document.querySelectorAll(".sidebar a");
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    links.forEach((l) => l.classList.remove("active"));
    e.target.classList.add("active");
  });
});

// cerrar todos los .modal
const closeModals = () => {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });
};

// abrir modales
const setupModal = (modalId, openButtonClass, closeButtonClass) => {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`No se encontró un modal con el ID: ${modalId}`);
    return;
  }

  const openModalBtns = document.querySelectorAll(`.${openButtonClass}`);
  if (openModalBtns.length === 0) {
    console.error(`No se encontraron botones con la clase: ${openButtonClass}`);
    return;
  }

  const closeModalBtn = modal.querySelector(`.${closeButtonClass}`);
  if (!closeModalBtn) {
    console.error(
      `No se encontró un botón de cierre con la clase: ${closeButtonClass} dentro del modal: ${modalId}`
    );
    return;
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault(); // Previene la recarga de la página
      modal.style.display = "flex";
    });
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

setupModal("edit-modal", "open-edit-proyecto-btn", "close");
setupModal("add-modal", "btn-add-modal", "close");
setupModal("add-modal-tarea", "btn-add-modal-tarea", "close");
setupModal("edit-modal-tarea", "open-edit-tarea", "close");

document
  .getElementById("open-view-btn-tareas")
  .addEventListener("click", (event) => {
    const tareas = document.querySelectorAll(`.${"tarea"}`);

    if (tareas.length === 0) {
      console.error(`No se encontraron elementos con la clase: ${"tarea"}`);
      return;
    }

    tareas.forEach((tarea) => {
      if (tarea.classList.contains("hidden")) {
        tarea.classList.remove("hidden");
        event.preventDefault();
      } else {
        tarea.classList.add("hidden");
        event.preventDefault();
      }
    });
  });
