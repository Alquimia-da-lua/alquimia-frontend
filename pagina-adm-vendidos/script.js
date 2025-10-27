function switchTab(element, tabName) {
  // Remove o ativo de todos os botões de tab
  document.querySelectorAll(".btn-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Adiciona o ativo no botão clicado
  element.classList.add("active");

  // Esconde todos os conteúdos das tabs
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.style.display = "none";
  });

  // Mostra o conteúdo da tab selecionada
  document.getElementById(tabName).style.display = "block";
}

function openModalNovoProduto() {
  // Clica no segundo botão de tab (Cadastrar Produto)
  document.querySelectorAll(".btn-tab")[1].click();
}

// Controla o cadastro de produto
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Produto cadastrado com sucesso!");
  this.reset();
});

// Controla o botão de editar
document.querySelectorAll(".action-btn.edit").forEach((btn) => {
  btn.addEventListener("click", function () {
    openModalNovoProduto();
  });
});

// Controla o botão de deletar
document.querySelectorAll(".action-btn.delete").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      alert("Produto deletado com sucesso!");
      // Aqui adicionar a lógica para remover a linha da tabela
      // this.closest('tr').remove();
    }
  });
});

// Drag and drop para upload de imagem
const uploadArea = document.querySelector(".upload-area");

if (uploadArea) {
  // Evento de arrastar sobre a área
  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.classList.add("border-primary");
    this.style.borderColor = "var(--primary-purple)";
    this.style.backgroundColor = "rgba(199, 125, 255, 0.1)";
  });

  // Evento de sair da área
  uploadArea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.classList.remove("border-primary");
    this.style.borderColor = "";
    this.style.backgroundColor = "";
  });

  // Evento de soltar arquivo
  uploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    this.classList.remove("border-primary");
    this.style.borderColor = "";
    this.style.backgroundColor = "";
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const imageInput = document.getElementById("imageInput");
      imageInput.files = files;
      
      // Exibe o nome do arquivo
      console.log("Imagem carregada via drag and drop:", files[0].name);
      
      // Opcional: mostrar preview da imagem
      showImagePreview(files[0]);
    }
  });

  // Evento de mudança no input de arquivo
  document.getElementById("imageInput").addEventListener("change", function(e) {
    if (this.files.length > 0) {
      console.log("Imagem selecionada:", this.files[0].name);
      showImagePreview(this.files[0]);
    }
  });
}

// Função para mostrar preview da imagem (opcional)
function showImagePreview(file) {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const uploadArea = document.querySelector(".upload-area");
      // Atualiza o conteúdo da área de upload com preview
      uploadArea.innerHTML = `
        <img src="${e.target.result}" alt="Preview" class="img-fluid rounded mb-2" style="max-height: 200px;">
        <div class="fw-semibold text-primary-purple">${file.name}</div>
        <div class="text-muted small mt-2">Clique para alterar a imagem</div>
      `;
    };
    reader.readAsDataURL(file);
  }
}