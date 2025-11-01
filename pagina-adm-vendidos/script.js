// URLs da API e variáveis globais
const API_BASE_URL = "http://localhost:8084/api";
const URL_PEDIDOS = `${API_BASE_URL}/pedido/listar`;
const URL_PRODUTOS = `${API_BASE_URL}/produto/listar`;
const URL_PRODUTO_CRIAR = `${API_BASE_URL}/produto`;
const URL_PRODUTO_ATUALIZAR = `${API_BASE_URL}/produto/alterar`;
const URL_PRODUTO_DELETAR = `${API_BASE_URL}/produto/delete`;

let listaPedidos = [];
let listaProdutos = [];
let produtoEmEdicao = null; // Armazena o produto sendo editado

// ==================== FUNÇÕES DE API ====================

// Função genérica de fetch
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro na rede: status ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    }
    return { success: true, status: response.status };
  } catch (error) {
    throw error;
  }
}

// Buscar todos os produtos
async function buscarProdutos() {
  try {
    const dados = await fetchData(URL_PRODUTOS);
    return dados;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

// Criar novo produto
async function criarProduto(produto) {
  try {
    const response = await fetchData(URL_PRODUTO_CRIAR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });
    return response;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
}

// Atualizar produto existente
async function atualizarProduto(id, produto) {
  try {
    const response = await fetchData(`${URL_PRODUTO_ATUALIZAR}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

// // Deletar produto
async function deletarProdutoAPI(id) {
  try {
    const response = await fetchData(`${URL_PRODUTO_DELETAR}/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw error;
  }
}

// Buscar todos os pedidos
async function buscarPedidos() {
  try {
    const dados = await fetchData(URL_PEDIDOS);
    return dados;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener("DOMContentLoaded", () => {
  inicializarProdutos();
  inicializarPedidos();
  configurarFormularioProduto();
});

// Inicializa a lista de produtos
async function inicializarProdutos() {
  const tbody = document.querySelector("#lista tbody");
  const contador = document.querySelector("#lista .text-muted.small");

  if (tbody) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center text-primary py-4">Carregando produtos...</td></tr>';
  }

  try {
    const dados = await buscarProdutos();
    listaProdutos = dados;
    renderizarProdutos(listaProdutos);
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Erro ao carregar produtos: ${err.message}</td></tr>`;
    }
    if (contador) {
      contador.textContent = "Erro ao carregar produtos";
    }
  }
}

// Inicializa a lista de pedidos
async function inicializarPedidos() {
  const tbody = document.querySelector("#pedidos tbody");

  if (tbody) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="text-center text-primary py-4">Carregando pedidos...</td></tr>';
  }

  try {
    const dados = await buscarPedidos();
    listaPedidos = dados;
    console.log("Pedidos carregados:", listaPedidos);
    renderizarPedidos(listaPedidos);
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-4">Erro ao carregar pedidos: ${err.message}</td></tr>`;
    }
  }
}

// ==================== RENDERIZAR DE PRODUTOS ====================

function renderizarProdutos(produtos) {
  const tbody = document.querySelector("#lista tbody");
  const contador = document.querySelector("#lista .text-muted.small");

  if (!tbody) {
    console.error("Elemento tbody não encontrado");
    return;
  }

  // Limpa o conteúdo anterior
  tbody.innerHTML = "";

  // Verifica se há produtos
  if (!produtos || produtos.length === 0) {
    tbody.innerHTML = criarLinhaVaziaProdutos();
    if (contador) contador.textContent = "0 produtos cadastrados";
    return;
  }

  // Renderiza cada produto
  produtos.forEach((produto) => {
    tbody.innerHTML += criarLinhaProduto(produto);
  });

  // Atualiza contador
  if (contador) {
    contador.textContent = `${produtos.length} produto${
      produtos.length !== 1 ? "s" : ""
    } cadastrado${produtos.length !== 1 ? "s" : ""}`;
  }
}

function criarLinhaProduto(produto) {
  let descricao = produto.dsProduto.slice(0, 70) + "...";
  return `
    <tr data-id="${produto.cdProduto || ""}">
      <td>
        <img
          src="${produto.imagem}"
          alt="${produto.nmProduto || "Produto"}"
          class="rounded"
          style="width: 80px; height: 80px; object-fit: cover"
          
        />
      </td>
      <td>
        <div class="d-flex flex-column gap-1">
          <span class="fw-semibold">${produto.nmProduto || "Sem nome"}</span>
          <span class="text-muted small">${descricao || "Sem descrição"}</span>
        </div>
      </td>
      <td>
        <span class="badge bg-light text-dark rounded-2 px-3 py-2">
          ${produto.categoria || "Sem categoria"}
        </span>
      </td>
      <td>
        <span class="fw-semibold text-primary-purple">
          R$ ${formatarPreco(produto.vlProduto)}
        </span>
      </td>
      <td>
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-secondary btn-sm action-btn edit p-2"
            title="Editar"
            onclick="editarProduto(${produto.cdProduto || 0})"
          >
            <img
              src="../images/icon/pincel.png"
              alt="Editar"
              style="width: 1.5rem"
            />
          </button>
          <button
            class="btn btn-outline-danger btn-sm action-btn delete p-2"
            title="Deletar"
            onclick="deletarProduto(${produto.cdProduto || 0})"
          >
            <img
              src="../images/icon/lixo.png"
              alt="Deletar"
              style="width: 1.5rem"
            />
          </button>
        </div>
      </td>
    </tr>
  `;
}

function criarLinhaVaziaProdutos() {
  return `
    <tr>
      <td colspan="5" class="text-center text-muted py-4">
        <i class="fas fa-box-open fa-3x mb-3 d-block"></i>
        <p class="mb-0">Nenhum produto cadastrado</p>
        <small>Clique em "Novo Produto" para adicionar</small>
      </td>
    </tr>
  `;
}

// ==================== RENDERIZAÇÃO DE PEDIDOS ====================

function renderizarPedidos(pedidos) {
  const tbody = document.querySelector("#pedidos tbody");

  if (!tbody) {
    console.error("Elemento tbody de pedidos não encontrado");
    return;
  }

  // Limpa o conteúdo anterior
  tbody.innerHTML = "";

  // Verifica se há pedidos
  if (!pedidos || pedidos.length === 0) {
    tbody.innerHTML = criarLinhaVaziaPedidos();
    return;
  }

  // Renderiza cada pedido
  pedidos.forEach((pedido) => {
    tbody.innerHTML += criarLinhaPedido(pedido);
  
  });
}

function criarLinhaPedido(pedido) {
  const numeroPedido = pedido.cdPedido
    ? `#${String(pedido.cdPedido).padStart(4, "0")}`
    : "#0000";
  const nomeCliente = pedido.cdUsuario.nmUsuario || "Cliente não identificado";
  let status = pedido.statusPedido;
  if (status == "ENVIADO") {
    status = "Enviado";
  } else if (status == "CANCELADO") {
    status = "Cancelado";
  } else if (status == "ENTREGUE") {
    status = "Entregue";
  } else {
    status = "Em análise";
  }

  const produtos = pedido.itens || [];
  const endereco = pedido.cdUsuario.cdEndereço || "Sem endereço cadastrado";

  // Cria descrição resumida dos produtos
  let descricaoProdutos = "Sem produtos";
  if (produtos.length > 0) {
    if (produtos.length === 1) {
      descricaoProdutos =
        produtos[0].nome || produtos[0].descricao || "Produto";
    } else {
      descricaoProdutos = `${produtos.length} produtos: ${
        produtos[0].nome || "Produto"
      }${produtos.length > 1 ? " e outros" : ""}`;
    }
  }

  return `
    <tr data-id="${pedido.cdPedido || ""}">
      <td>
        <span class="h4 mb-0">${numeroPedido}</span>
      </td>
      <td>
        <div class="d-flex flex-column gap-1">
          <span class="fw-semibold">${nomeCliente}</span>
          <span class="text-muted small">${endereco}</span>
        </div>
      </td>
      <td>
        <div class="d-flex align-items-center gap-2 bg-light-gray rounded-pill p-2 badge-pedido">
          <span class="fs-6 display-5 flex-grow-1 text-center py-2">${status}</span>
          <button
            class="btn btn-primary-custom btn-sm rounded-pill px-3 btn-pedido"
            onclick="visualizarPedido(${pedido.cdPedido || 0})"
          >
            Visualizar pedido
          </button>
        </div>
      </td>
    </tr>
  `;
}

function criarLinhaVaziaPedidos() {
  return `
    <tr>
      <td colspan="3" class="text-center text-muted py-4">
        <i class="fas fa-shopping-cart fa-3x mb-3 d-block"></i>
        <p class="mb-0">Nenhum pedido encontrado</p>
        <small>Os pedidos vendidos aparecerão aqui</small>
      </td>
    </tr>
  `;
}

// ==================== MODAL DE PEDIDO ====================

function visualizarPedido(id) {
  const pedido = listaPedidos.find((p) => p.cdPedido == id);

  if (!pedido) {
    console.error("Pedido não encontrado:", id);
    alert("Pedido não encontrado!");
    return;
  }

  // Atualiza título do modal
  const numeroPedido = pedido.cdPedido
    ? `#${String(pedido.cdPedido).padStart(4, "0")}`
    : "#0000";
  document.getElementById(
    "modalPedidoLabel"
  ).textContent = `Pedido ${numeroPedido}`;

  // Cria conteúdo do modal
  const modalBody = document.querySelector("#modalPedido .modal-body");
  modalBody.innerHTML = criarConteudoModalPedido(pedido);

  // Abre o modal
  const modal = new bootstrap.Modal(document.getElementById("modalPedido"));
  modal.show();
}

function criarConteudoModalPedido(pedido) {
  const nomeCliente = pedido.cdUsuario.nmUsuario || "Cliente não identificado";
  const produtos = pedido.itens || [];
  const enderecoEntrega = pedido.cdUsuario.cdEndereco || null;

  let html = `<h5 class="mb-3">${nomeCliente}</h5>`;

  // Informações do cliente
  if (pedido.cliente?.email || pedido.cdUsuario.emailUsuario) {
    html += `<p class="text-muted small mb-3"><i class="fas fa-envelope me-2"></i>${
      pedido.cliente?.email || pedido.cdUsuario.emailUsuario
    }</p>`;
  }

  if (pedido.cliente?.telefone || pedido.cdUsuario.nuTelefone) {
    html += `<p class="text-muted small mb-3"><i class="fas fa-phone me-2"></i>${
      pedido.cliente?.telefone || pedido.cdUsuario.nuTelefone
    }</p>`;
  }

  // Endereço de entrega
  if (enderecoEntrega) {
    html += `
      <div class="mb-3">
        <h6 class="mb-2"><i class="fas fa-map-marker-alt me-2"></i>Endereço de Entrega:</h6>
        <p class="text-muted small mb-0">${enderecoEntrega}</p>
      </div>
    `;
  }

  // Lista de produtos
  html += `<h6 class="mb-2">Produtos:</h6>`;

  if (produtos.length === 0) {
    html += `<p class="text-muted mt-3">Nenhum produto neste pedido</p>`;
  } else {
    html += `<ol class="list-group list-group-numbered">`;

    produtos.forEach((produto) => {
      html += criarItemProdutoModal(produto);
    });

    html += `</ol>`;

    // Total do pedido
    const total = calcularTotalPedido(produtos);
    html += `
      <div class="mt-3 pt-3 border-top">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold">Total do Pedido:</span>
          <span class="h5 mb-0 text-primary-purple">R$ ${formatarPreco(
            total
          )}</span>
        </div>
      </div>
    `;
  }

  return html;
}

function criarItemProdutoModal(produto) {
  const nome = produto.cdProduto.nmProduto || "Produto sem nome";
  const descricao =
    produto.cdProduto.dsProduto.slice(0, 100) + "..." || "Sem descrição";
  const preco = produto.vlItemPedido || 0;
  const quantidade = produto.qtItemPedido || 1;
  const subtotal = preco * quantidade;

  return `
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">${nome}</div>
        <small class="text-muted">${descricao}</small>
        <div class="mt-1">
          <span class="text-primary-purple fw-semibold">R$ ${formatarPreco(
            preco
          )}</span>
          <span class="text-muted small"> × ${quantidade}</span>
          <span class="text-muted small"> = R$ ${formatarPreco(subtotal)}</span>
        </div>
      </div>
      <span class="badge bg-primary-purple rounded-pill">${quantidade}</span>
    </li>
  `;
}

// ==================== AÇÕES DE PRODUTOS ====================

function editarProduto(id) {
  const produto = listaProdutos.find((p) => p.cdProduto == id);

  if (!produto) {
    console.error("Produto não encontrado:", id);
    alert("Produto não encontrado!");
    return;
  }

  // Armazena o produto sendo editado
  produtoEmEdicao = produto;

  // Muda para a aba de cadastro
  openModalNovoProduto();

  // Preenche o formulário com os dados do produto
  document.getElementById("productName").value = produto.nmProduto || "";
  document.getElementById("productCategory").value = produto.categoria || "";
  document.getElementById("productPrice").value = produto.vlProduto || "";
  document.getElementById("productDescription").value = produto.dsProduto || "";

  // Atualiza o título do formulário
  const tituloForm = document.querySelector("#cadastro h2");
  if (tituloForm) {
    tituloForm.textContent = "Editar Produto";
  }

  // Atualiza texto do botão
  const btnSubmit = document.querySelector(
    '#productForm button[type="submit"]'
  );
  if (btnSubmit) {
    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Atualizar Produto';
  }

  // Mostra preview da imagem se existir
  if (produto.imagem) {
    const uploadArea = document.querySelector(".upload-area");
    if (uploadArea) {
      uploadArea.innerHTML = `
        <img src="${produto.imagem}" alt="Preview" class="img-fluid rounded mb-2" style="max-height: 200px;">
        <div class="fw-semibold text-primary-purple">Imagem atual</div>
        <div class="text-muted small mt-2">Clique para alterar a imagem</div>
      `;
    }
  }
}

async function deletarProduto(id) {
  const produto = listaProdutos.find((p) => p.cdProduto == id);
  if (!produto) {
    console.error("Produto não encontrado:", id);
    alert("Produto não encontrado!");
    return;
  }

  if (
    confirm(
      `Tem certeza que deseja deletar o produto:\n"${produto.nmProduto}"?`
    )
  ) {
    try {
      // Chama a API para deletar
      await deletarProdutoAPI(produto.cdProduto);

      // Remove da lista local e re-renderiza
      listaProdutos = listaProdutos.filter((p) => p.cdProduto != id);
      renderizarProdutos(listaProdutos);

      alert("Produto deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto. Tente novamente.");
    }
  }
}

// ==================== FORMULÁRIO DE PRODUTOS ====================

function configurarFormularioProduto() {
  const form = document.getElementById("productForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const usuario = JSON.parse(usuarioLogado);
    // Coleta os dados do formulário
    const dadosProduto = {
      nmProduto: document.getElementById("productName").value.trim(),
      categoria: document.getElementById("productCategory").value.toUpperCase(),
      vlProduto: parseFloat(document.getElementById("productPrice").value),
      dsProduto: document.getElementById("productDescription").value.trim(),
      cdUsuario: 1,
      // cdUsuario: usuario.cdUsuario,
      imagem: "", // Processar upload de imagem real
    };

    // Validação básica
    if (
      !dadosProduto.nmProduto ||
      !dadosProduto.categoria ||
      !dadosProduto.vlProduto
    ) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (dadosProduto.vlProduto <= 0) {
      alert("O preço deve ser maior que zero!");
      return;
    }

    try {
      // Desabilita o botão durante o envio
      const btnSubmit = form.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Salvando...';

      if (produtoEmEdicao) {
        // Atualizar produto existente
        const id = parseInt(produtoEmEdicao.cdProduto, 10);
        await atualizarProduto(id, dadosProduto);
        alert("Produto atualizado com sucesso!");
      } else {
        // Criar novo produto
        await criarProduto(dadosProduto);
        alert("Produto cadastrado com sucesso!");
      }

      // Recarrega a lista de produtos
      await inicializarProdutos();

      // Limpa o formulário e reseta estado
      limparFormularioProduto();

      // Volta para a lista de produtos
      document.querySelectorAll(".btn-tab")[0].click();

      // Restaura o botão
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = textoOriginal;
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");

      // Restaura o botão em caso de erro
      const btnSubmit = form.querySelector('button[type="submit"]');
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = produtoEmEdicao
        ? '<i class="fas fa-save"></i> Atualizar Produto'
        : '<i class="fas fa-save"></i> Cadastrar Produto';
    }
  });

  // Botão cancelar
  const btnCancelar = form.querySelector('button[type="reset"]');
  if (btnCancelar) {
    btnCancelar.addEventListener("click", function (e) {
      e.preventDefault();
      limparFormularioProduto();
      document.querySelectorAll(".btn-tab")[0].click();
    });
  }
}

function limparFormularioProduto() {
  const form = document.getElementById("productForm");
  if (form) {
    form.reset();
  }

  // Reseta o produto em edição
  produtoEmEdicao = null;

  // Restaura título
  const tituloForm = document.querySelector("#cadastro h2");
  if (tituloForm) {
    tituloForm.textContent = "Cadastro de Produto";
  }

  // Restaura botão
  const btnSubmit = document.querySelector(
    '#productForm button[type="submit"]'
  );
  if (btnSubmit) {
    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Cadastrar Produto';
  }

  // Restaura área de upload
  const uploadArea = document.querySelector(".upload-area");
  if (uploadArea) {
    uploadArea.innerHTML = `
      <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
      <div class="fw-semibold text-primary-purple mb-1">Clique para fazer upload</div>
      <div class="text-muted small">ou arraste a imagem</div>
      <div class="text-muted small">PNG, JPG ou WEBP (MÁX. 5MB)</div>
      <input type="file" id="imageInput" accept="image/*" class="d-none" />
    `;
  }
}

// ==================== NAVEGAÇÃO DE TABS ====================

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

  // Se estiver voltando para lista, limpa o formulário
  if (tabName === "lista") {
    limparFormularioProduto();
  }
}

function openModalNovoProduto() {
  // Clica no segundo botão de tab (Cadastrar Produto)
  document.querySelectorAll(".btn-tab")[1].click();
}

// ==================== UPLOAD DE IMAGEM ====================

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
      if (imageInput) {
        imageInput.files = files;
        console.log("Imagem carregada via drag and drop:", files[0].name);
        showImagePreview(files[0]);
      }
    }
  });
}

// Evento de mudança no input de arquivo
document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  if (imageInput) {
    imageInput.addEventListener("change", function (e) {
      if (this.files.length > 0) {
        console.log("Imagem selecionada:", this.files[0].name);
        showImagePreview(this.files[0]);
      }
    });
  }
});

// Função para mostrar preview da imagem
function showImagePreview(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const uploadArea = document.querySelector(".upload-area");
      if (uploadArea) {
        uploadArea.innerHTML = `
          <img src="${e.target.result}" alt="Preview" class="img-fluid rounded mb-2" style="max-height: 200px;">
          <div class="fw-semibold text-primary-purple">${file.name}</div>
          <div class="text-muted small mt-2">Clique para alterar a imagem</div>
        `;
      }
    };
    reader.readAsDataURL(file);
  }
}

// ==================== FUNÇÕES AUXILIARES ====================

function formatarPreco(preco) {
  if (!preco && preco !== 0) return "0,00";
  return Number(preco).toFixed(2).replace(".", ",");
}

function calcularTotalPedido(produtos) {
  return produtos.reduce((total, produto) => {
    const preco = produto.vlItemPedido || 0;
    const quantidade = produto.qtItemPedido || 1;
    return total + preco * quantidade;
  }, 0);
}
