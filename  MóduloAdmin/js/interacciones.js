document.addEventListener("DOMContentLoaded", () => {
  // Inicializar partículas
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
    console.error("particles.js no está definido. Verifique si se cargó correctamente.");
  }

  const modalDetails = document.getElementById("modal-details");
  const modalEdit = document.getElementById("edit-modal");
  const modalDelete = document.getElementById("modal-delete");
  const modalAssign = document.getElementById("assign-modal");
  const modalToggleRole = document.getElementById("toggle-modal");

  const closeModals = () => {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
  };

  // Ver detalles
  document.querySelectorAll(".btn-action.view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr").children;
      document.getElementById("detail-name").textContent = row[0].textContent;
      document.getElementById("detail-username").textContent = row[1].textContent;
      document.getElementById("detail-email").textContent = row[2].textContent;
      document.getElementById("detail-type").textContent = row[3].textContent;
      document.getElementById("detail-status").textContent = row[4].textContent;
      modalDetails.style.display = "flex";
    });
  });

  // Editar
  document.querySelectorAll(".btn-action.edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr").children;

      // Llenar los valores del modal de edición
      document.getElementById("edit-name").value = row[0].textContent;
      document.getElementById("edit-username").value = row[1].textContent;
      document.getElementById("edit-email").value = row[2].textContent;
      document.getElementById("edit-password").value = ""; // Limpiar el campo de contraseña
      document.getElementById("edit-role").value = row[3].textContent;
      document.getElementById("edit-status").value = row[4].textContent;

      // Mostrar el modal
      modalEdit.style.display = "flex";
    });
  });

  // Eliminar
  document.querySelectorAll(".btn-action.delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("delete-user-name").textContent = btn.dataset.user;
      modalDelete.style.display = "flex";
    });
  });

  // Activar/Desactivar
  document.querySelectorAll(".btn-action.toggle-role").forEach((btn) => {
    btn.addEventListener("click", () => {
      const user = btn.dataset.user;
      const isActive = btn.textContent.trim().includes("Desactivar");
      const action = isActive ? "Activar" : "Desactivar";

      // Actualizamos el ícono y el texto del botón
      btn.innerHTML = isActive
        ? '<i class="fas fa-toggle-off"></i> Activar'
        : '<i class="fas fa-toggle-on"></i> Desactivar';

      // Mostrar el modal con la acción correspondiente
      document.getElementById("toggle-user-name").textContent = user;
      document.getElementById("toggle-action").textContent = action.toLowerCase();
      modalToggleRole.style.display = "flex";

      document.querySelector(".btn-confirm-toggle").onclick = () => {
        alert(`El usuario ${user} ha sido ${action.toLowerCase()} correctamente.`);
        closeModals();
      };
    });
  });

  // Asignar Rol
  document.querySelectorAll(".btn-action.assign-role").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("assign-user").textContent = btn.dataset.user;
      modalAssign.style.display = "flex";
    });
  });

  // Cerrar Modales
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", closeModals);
  });

  // Confirmar acciones
  document.querySelector(".btn-confirm-delete").addEventListener("click", () => {
    alert("Usuario eliminado.");
    closeModals();
  });

  document.querySelector(".btn-confirm-assign").addEventListener("click", () => {
    alert("Rol asignado correctamente.");
    closeModals();
  });
});