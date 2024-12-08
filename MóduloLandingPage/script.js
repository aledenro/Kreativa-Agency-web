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

document.addEventListener("DOMContentLoaded", function () {
  const switchInput = document.getElementById("flexSwitchCheckDefault");
  const switchLabel = document.querySelector(
    'label[for="flexSwitchCheckDefault"]'
  );

  function updateSwitchLabel() {
    switchLabel.textContent = switchInput.checked
      ? "Desactivar formulario"
      : "Activar formulario";
  }

  updateSwitchLabel();

  switchInput.addEventListener("change", updateSwitchLabel);
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
  const openModalBtn = document.querySelector(`.${openButtonClass}`);
  const closeModalBtn = modal.querySelector(`.${closeButtonClass}`);

  openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
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

setupModal("edit-modal", "open-edit-btn", "close");
setupModal("add-modal", "open-add-btn", "close");
