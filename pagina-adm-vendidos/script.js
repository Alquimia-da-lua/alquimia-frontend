// URLs da API e variáveis globais
const API_BASE_URL = "http://localhost:8084/api";
const URL_PEDIDOS = `${API_BASE_URL}/pedido/listar`;
const URL_PRODUTOS = `${API_BASE_URL}/produto/listar`;
const URL_PRODUTO_CRIAR = `${API_BASE_URL}/produto`;
const URL_PRODUTO_ATUALIZAR = `${API_BASE_URL}/produto/alterar`;
const URL_PRODUTO_DELETAR = `${API_BASE_URL}/produto/delete`;
const URL_ENDERECO_CLIENTE = `${API_BASE_URL}/endereco/cliente`;
const user = JSON.parse(localStorage.getItem('usuario'));

const TOKEN = `${user?.token}`

let listaPedidos = [];
let listaProdutos = [];
let produtoEmEdicao = null;

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
        'Authorization': `Bearer ${TOKEN}`
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
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify(produto),
    });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

// Deletar produto
async function deletarProdutoAPI(id) {
  try {
    const response = await fetchData(`${URL_PRODUTO_DELETAR}/${id}`, {
      method: "DELETE",
      headers:{
        'Authorization': `Bearer ${TOKEN}`,
      }
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
     if (!TOKEN) {
      throw new Error('Token não encontrado');
    }
    const dados = await fetchData(URL_PEDIDOS,{
      headers:{
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    return dados;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }
}

// Buscar endereço de um cliente específico
async function buscarEnderecoCliente(cdCliente) {
  try {
    const dados = await fetchData(`${URL_ENDERECO_CLIENTE}/${cdCliente}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    return dados;
  } catch (error) {
    console.error(`Erro ao buscar endereço do cliente ${cdCliente}:`, error);
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
    await renderizarPedidos(listaPedidos);
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-4">Erro ao carregar pedidos: ${err.message}</td></tr>`;
    }
  }
}

// ==================== RENDERIZAÇÃO DE PRODUTOS ====================

function renderizarProdutos(produtos) {
  const tbody = document.querySelector("#lista tbody");
  const contador = document.querySelector("#lista .text-muted.small");

  if (!tbody) {
    console.error("Elemento tbody não encontrado");
    return;
  }

  tbody.innerHTML = "";

  if (!produtos || produtos.length === 0) {
    tbody.innerHTML = criarLinhaVaziaProdutos();
    if (contador) contador.textContent = "0 produtos cadastrados";
    return;
  }

  produtos.forEach((produto) => {
    tbody.innerHTML += criarLinhaProduto(produto);
  });

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

async function renderizarPedidos(pedidos) {
  const tbody = document.querySelector("#pedidos tbody");

  if (!tbody) {
    console.error("Elemento tbody de pedidos não encontrado");
    return;
  }

  tbody.innerHTML = "";

  if (!pedidos || pedidos.length === 0) {
    tbody.innerHTML = criarLinhaVaziaPedidos();
    return;
  }

  for (const pedido of pedidos) {
    const linhaHtml = await criarLinhaPedidoComEndereco(pedido);
    tbody.innerHTML += linhaHtml;
  }
}

async function criarLinhaPedidoComEndereco(pedido) {
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

  let enderecoFormatado = "Sem endereço cadastrado";
  try {
    const cdCliente = pedido.cdUsuario.cdUsuario;
    const endereco = await buscarEnderecoCliente(cdCliente);
    
    if (endereco) {
      enderecoFormatado = formatarEndereco(endereco);
    }
  } catch (error) {
    console.error(`Erro ao buscar endereço do cliente ${pedido.cdUsuario.cdUsuario}:`, error);
  }

  return `
    <tr data-id="${pedido.cdPedido || ""}">
      <td>
        <span class="h4 mb-0">${numeroPedido}</span>
      </td>
      <td>
        <div class="d-flex flex-column gap-1">
          <span class="fw-semibold">${nomeCliente}</span>
          <span class="text-muted small">${enderecoFormatado}</span>
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

async function visualizarPedido(id) {
  const pedido = listaPedidos.find((p) => p.cdPedido == id);

  if (!pedido) {
    console.error("Pedido não encontrado:", id);
    alert("Pedido não encontrado!");
    return;
  }

  const numeroPedido = pedido.cdPedido
    ? `#${String(pedido.cdPedido).padStart(4, "0")}`
    : "#0000";
  document.getElementById(
    "modalPedidoLabel"
  ).textContent = `Pedido ${numeroPedido}`;

  const modalBody = document.querySelector("#modalPedido .modal-body");
  modalBody.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin fa-2x text-primary"></i><p class="mt-2">Carregando detalhes...</p></div>';

  const modal = new bootstrap.Modal(document.getElementById("modalPedido"));
  modal.show();

  const conteudo = await criarConteudoModalPedidoComEndereco(pedido);
  modalBody.innerHTML = conteudo;
}

async function criarConteudoModalPedidoComEndereco(pedido) {
  const nomeCliente = pedido.cdUsuario.nmUsuario || "Cliente não identificado";
  const produtos = pedido.itens || [];

  let html = `<h5 class="mb-3">${nomeCliente}</h5>`;

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

  try {
    const cdCliente = pedido.cdUsuario.cdUsuario;
    const endereco = await buscarEnderecoCliente(cdCliente);
    
    if (endereco) {
      const enderecoCompleto = formatarEnderecoCompleto(endereco);
      html += `
        <div class=" mb-3">
          <h6 class="mb-2"><i class="fas fa-map-marker-alt me-2"></i>Endereço de Entrega:</h6>
          <p class="text-muted small mb-0">${enderecoCompleto}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Erro ao buscar endereço para o modal:", error);
    html += `
      <div class="mb-3">
        <h6 class="mb-2"><i class="fas fa-map-marker-alt me-2"></i>Endereço de Entrega:</h6>
        <p class="text-muted small mb-0">Não foi possível carregar o endereço</p>
      </div>
    `;
  }

  html += `<h6 class="mb-2">Produtos:</h6>`;

  if (produtos.length === 0) {
    html += `<p class="text-muted mt-3">Nenhum produto neste pedido</p>`;
  } else {
    html += `<ol class="list-group list-group-numbered">`;

    produtos.forEach((produto) => {
      html += criarItemProdutoModal(produto);
    });

    html += `</ol>`;

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

  produtoEmEdicao = produto;
  openModalNovoProduto();

  document.getElementById("productName").value = produto.nmProduto || "";
  document.getElementById("productCategory").value = produto.categoria || "";
  document.getElementById("productPrice").value = produto.vlProduto || "";
  document.getElementById("productDescription").value = produto.dsProduto || "";

  const tituloForm = document.querySelector("#cadastro h2");
  if (tituloForm) {
    tituloForm.textContent = "Editar Produto";
  }

  const btnSubmit = document.querySelector(
    '#productForm button[type="submit"]'
  );
  if (btnSubmit) {
    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Atualizar Produto';
  }

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
      await deletarProdutoAPI(produto.cdProduto);
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

    const usuarioLogado = localStorage.getItem("usuario");
    const usuario = JSON.parse(usuarioLogado);

    const dadosProduto = {
      nmProduto: document.getElementById("productName").value.trim(),
      categoria: document.getElementById("productCategory").value.toUpperCase(),
      vlProduto: parseFloat(document.getElementById("productPrice").value),
      dsProduto: document.getElementById("productDescription").value.trim(),
      cdUsuario: usuario.cdUsuario,
      imagem: "",
    };

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
      const btnSubmit = form.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Salvando...';

      if (produtoEmEdicao) {
        const id = parseInt(produtoEmEdicao.cdProduto, 10);
        await atualizarProduto(id, dadosProduto);
        alert("Produto atualizado com sucesso!");
      } else {
        await criarProduto(dadosProduto);
        alert("Produto cadastrado com sucesso!");
      }

      await inicializarProdutos();
      limparFormularioProduto();
      document.querySelectorAll(".btn-tab")[0].click();

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = textoOriginal;
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");

      const btnSubmit = form.querySelector('button[type="submit"]');
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = produtoEmEdicao
        ? '<i class="fas fa-save"></i> Atualizar Produto'
        : '<i class="fas fa-save"></i> Cadastrar Produto';
    }
  });

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

  produtoEmEdicao = null;

  const tituloForm = document.querySelector("#cadastro h2");
  if (tituloForm) {
    tituloForm.textContent = "Cadastro de Produto";
  }

  const btnSubmit = document.querySelector(
    '#productForm button[type="submit"]'
  );
  if (btnSubmit) {
    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Cadastrar Produto';
  }

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
  document.querySelectorAll(".btn-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  element.classList.add("active");

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.style.display = "none";
  });

  document.getElementById(tabName).style.display = "block";

  if (tabName === "lista") {
    limparFormularioProduto();
  }
}

function openModalNovoProduto() {
  document.querySelectorAll(".btn-tab")[1].click();
}

// ==================== UPLOAD DE IMAGEM ====================

const uploadArea = document.querySelector(".upload-area");

if (uploadArea) {
  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.classList.add("border-primary");
    this.style.borderColor = "var(--primary-purple)";
    this.style.backgroundColor = "rgba(199, 125, 255, 0.1)";
  });

  uploadArea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.classList.remove("border-primary");
    this.style.borderColor = "";
    this.style.backgroundColor = "";
  });

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

function formatarEndereco(endereco) {
  if (!endereco) return "Sem endereço cadastrado";
  
  const partes = [];
  
  if (endereco.dsLogradouro) partes.push(endereco.dsLogradouro);
  if (endereco.dsBairro) partes.push(endereco.dsBairro);
  if (endereco.dsLocalidade) partes.push(endereco.dsLocalidade);
  if (endereco.nmEstado) partes.push(endereco.nmEstado);
  
  return partes.length > 0 ? partes.join(", ") : "Sem endereço cadastrado";
}

function formatarEnderecoCompleto(endereco) {
  if (!endereco) return "Sem endereço cadastrado";
  
  let enderecoCompleto = "";
  
  if (endereco.dsLogradouro) {
    enderecoCompleto += endereco.dsLogradouro;
  }
  
  if (endereco.dsComplemento) {
    enderecoCompleto += `, ${endereco.dsComplemento}`;
  }
  
  if (endereco.dsBairro) {
    enderecoCompleto += `<br>${endereco.dsBairro}`;
  }
  
  if (endereco.dsLocalidade || endereco.nmEstado) {
    enderecoCompleto += `<br>${endereco.dsLocalidade || ""}${
      endereco.dsLocalidade && endereco.nmEstado ? " - " : ""
    }${endereco.nmEstado || ""}`;
  }
  
  if (endereco.nuCep) {
    enderecoCompleto += `<br>CEP: ${formatarCep(endereco.nuCep)}`;
  }
  
  return enderecoCompleto || "Sem endereço cadastrado";
}

function formatarCep(cep) {
  if (!cep) return "";
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.replace(/(\d{5})(\d{3})/, "$1-$2");
}