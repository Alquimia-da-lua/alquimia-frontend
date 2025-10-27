function selecionarPagamento(type) {
  document.querySelectorAll(".payment-option").forEach((option) => {
    option.classList.remove("active");
  });
  event.currentTarget.classList.add("active");

  document.getElementById(type).checked = true;
  
  const cardDetails = document.getElementById("cardDetails");
  const pixDetails = document.getElementById("pixDetails");
  if (type === "pix") {
    cardDetails.style.display = "none";
    pixDetails.style.display = "block"
  } else {
    cardDetails.style.display = "block";
     pixDetails.style.display = "none"
  }
}

// Máscara para telefone
document
  .querySelector('input[type="tel"]')
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
      e.target.value = value;
    }
  });

// Máscara para CEP
document
  .querySelectorAll('input[placeholder="00000-000"]')[0]
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d{3}).*/, "$1-$2");
    e.target.value = value;
  });

// Máscara para cartão
document
  .querySelectorAll('input[placeholder="0000 0000 0000 0000"]')[0]
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = value;
  });

// Máscara para validade
document
  .querySelectorAll('input[placeholder="MM/AA"]')[0]
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    e.target.value = value;
  });
