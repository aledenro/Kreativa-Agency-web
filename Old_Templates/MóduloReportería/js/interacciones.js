document.addEventListener("DOMContentLoaded", () => {
  const newQuotationLink = document.getElementById("new-quotation-link");
  const modal = document.getElementById("new-quotation-modal");
  const closeModal = document.getElementById("close-modal");
  const newQuotationForm = document.getElementById("new-quotation-form");

  // Abrir el modal
  newQuotationLink.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "flex";
  });

  // Cerrar el modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Manejar envío del formulario del modal
  newQuotationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const reason = document.getElementById("quotation-reason").value;
    alert(`Solicitud enviada:\nMotivo: ${reason}`);
    newQuotationForm.reset();
    modal.style.display = "none";
  });
});