document.addEventListener("DOMContentLoaded", function () {
    // Obtener los botones
    const btnProyectosProduccion = document.getElementById('btn-proyectos-produccion');
    const btnProyectosFinalizados = document.getElementById('btn-proyectos-finalizados');

    // Obtener las secciones correspondientes
    const seccionProduccion = document.getElementById('proyectos-produccion');
    const seccionFinalizados = document.getElementById('proyectos-finalizados');

    // Función para alternar la visibilidad de las secciones
    const toggleSections = (activeSection, inactiveSection, activeButton, inactiveButton) => {
        // Ocultar la sección inactiva
        inactiveSection.classList.remove('active');
        // Mostrar la sección activa
        activeSection.classList.add('active');
        // Cambiar el estado de los botones
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');
    };

    // Inicializar la vista por defecto: "Proyectos en Producción"
    toggleSections(seccionProduccion, seccionFinalizados, btnProyectosProduccion, btnProyectosFinalizados);

    // Cambiar a "Proyectos en Producción"
    btnProyectosProduccion.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar cualquier acción predeterminada
        toggleSections(seccionProduccion, seccionFinalizados, btnProyectosProduccion, btnProyectosFinalizados);
    });

    // Cambiar a "Proyectos Finalizados"
    btnProyectosFinalizados.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar cualquier acción predeterminada
        toggleSections(seccionFinalizados, seccionProduccion, btnProyectosFinalizados, btnProyectosProduccion);
    });     
  

    // ----------------------------- HISTORIA DE USUARIO 2 -----------------------------
    const btnHacerSugerencia = document.getElementById("btnHacerSugerencia");
    const btnInformarAvance = document.getElementById("btnInformarAvance");
    const btnVerAvances = document.getElementById("btnVerAvances");
    const btnAprobarProyecto = document.getElementById("btnAprobarProyecto");
    const modalAvance = document.getElementById("modalAvance");
    const modalSugerencia = document.getElementById("modalSugerencia");
    const modalVerAvances = document.getElementById("modalVerAvances");
    const contenedorAvances = document.getElementById("contenedorAvances");
    const contenedorSugerencias = document.getElementById("contenedorSugerencias");

    const closeModalAvance = document.getElementById("closeModalAvance");
    const closeModalSugerencia = document.getElementById("closeModalSugerencia");
    const closeModalVerAvances = document.getElementById("closeModalVerAvances");

    const inputSugerencia = document.getElementById("inputSugerencia");
    const inputAvance = document.getElementById("inputAvance");
    const inputArchivoAvance = document.getElementById("inputArchivoAvance");

    // Función para cerrar modales
    const closeModals = () => {
        modalAvance.style.display = "none";
        modalSugerencia.style.display = "none";
        modalVerAvances.style.display = "none";
    };

    // Mostrar modal de sugerencia
    btnHacerSugerencia.addEventListener("click", () => {
        modalSugerencia.style.display = "flex";
    });

    // Mostrar modal de informar avance
    btnInformarAvance.addEventListener("click", () => {
        modalAvance.style.display = "flex";
    });

    // Mostrar avances
    btnVerAvances.addEventListener("click", () => {
        modalVerAvances.style.display = "flex";
        // Simulando la visualización de avances
        contenedorAvances.innerHTML = `
      <div class="avance-item">
        <p><strong>Avance 1</strong>: Se completó la primera fase del proyecto.</p>
        <p>Fecha: 2024-12-08</p>
      </div>
    `;
    });

    // Aprobar proyecto (solo muestra un mensaje por ahora)
    btnAprobarProyecto.addEventListener("click", () => {
        alert("Avance aprobado");
    });

    // Enviar sugerencia
    document.getElementById("formSugerencia").addEventListener("submit", (e) => {
        e.preventDefault();
        const sugerencia = inputSugerencia.value;

        if (sugerencia) {
            const divSugerencia = document.createElement("div");
            divSugerencia.classList.add("sugerencia-item");
            divSugerencia.innerHTML = `
        <p>${sugerencia}</p>
      `;
            contenedorSugerencias.appendChild(divSugerencia);
            inputSugerencia.value = "";
            closeModals();
        } else {
            alert("Por favor, ingrese una sugerencia.");
        }
    });

    // Enviar avance
    document.getElementById("formAvance").addEventListener("submit", (e) => {
        e.preventDefault();
        const avance = inputAvance.value;
        const archivo = inputArchivoAvance.files[0];

        if (!avance || !archivo) {
            alert("Debe ingresar el texto del avance y seleccionar un archivo.");
            return;
        }

        // Simular la carga del avance
        const divAvance = document.createElement("div");
        divAvance.classList.add("avance-item");
        divAvance.innerHTML = `
      <p>${avance}</p>
      <a href="${URL.createObjectURL(archivo)}" target="_blank">Descargar archivo</a>
    `;
        contenedorAvances.appendChild(divAvance);

        inputAvance.value = "";
        inputArchivoAvance.value = "";
        closeModals();
    });

    // Cerrar modales
    closeModalAvance.addEventListener("click", closeModals);
    closeModalSugerencia.addEventListener("click", closeModals);
    closeModalVerAvances.addEventListener("click", closeModals);
});

//Regresar a mis proyectos
document.querySelector('.menu-btn:last-child').addEventListener('click', () => {
    window.location.href = 'dgp_019_ver_proyectos.html';
});

// Seleccionar todos los botones de aprobar
document.querySelectorAll('.btn-aprobar').forEach(button => {
    button.addEventListener('click', (e) => {
        // Al hacer clic en el botón, mostrar el mensaje "Avance aprobado"
        alert('Avance aprobado');
    });
});
