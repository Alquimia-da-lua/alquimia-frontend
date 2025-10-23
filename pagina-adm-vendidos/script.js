function switchTab(element, tabName) {
  // Remove o ativo de todos
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Adiciona o ativo no botão clicado
  element.classList.add("active");

  //Esconde todos os elementos
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.style.display = "none";
  });

  // Mostra o elemento na tab
  document.getElementById(tabName).style.display = "block";
}

function openModalNovoProduto() {
  document.querySelector(".nav-tab:nth-child(2)").click();
}

//Controla o cadastro
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Produto cadastrado com sucesso!");
  this.reset();
});

// Controla o editar
document.querySelectorAll(".action-btn.edit").forEach((btn) => {
  btn.addEventListener("click", function () {
    openModalNovoProduto()
  });
});

// Controla o delete
document.querySelectorAll(".action-btn.delete").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      alert("Produto deletado com sucesso!");
    }
  });
});
