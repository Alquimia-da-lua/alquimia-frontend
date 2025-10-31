
//função do fetch
const url = "http://localhost:8084/api/produto/listar";
let listaProdutosBancoDeDados = [];

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na rede: status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


//input busca e nav categorias
let termoBusca = "";
let categoriaAtiva = "inicio";

const linksCategoria = document.querySelectorAll(
  ".nav-custom-color a.nav-item"
);
const buscaInput = document.getElementById("buscaInput");

if (buscaInput) {
  buscaInput.addEventListener("input", function () {
    const accordionCollapse = document.querySelector("#collapseOne");
    if (accordionCollapse && window.bootstrap?.Collapse) {
      const bsCollapse =
        bootstrap.Collapse.getOrCreateInstance(accordionCollapse);
      if (this.value === "") bsCollapse.show();
      else bsCollapse.hide();
    }
    termoBusca = this.value;
    mostrarProdutos();
  });
}

export function setCategoriaAtiva(novaCategoria) {
  categoriaAtiva = novaCategoria;
  termoBusca = "";
  if (buscaInput) buscaInput.value = "";

  mostrarProdutos();
}

function atualizarEstiloAtivo(linkClicado) {
  linksCategoria.forEach((l) => l.classList.remove("active"));
  linkClicado.classList.add("active");
}

//filtrar produtos

function filtrarProdutos() {
  const termo = termoBusca.toLowerCase();
  const cat = categoriaAtiva.toLowerCase();

  return listaProdutosBancoDeDados.filter((produto) => {
    const categoriaProduto = produto.categoria.toLowerCase();
    const nomeProduto = produto.nmProduto.toLowerCase();

    if (termo !== "") {
      return nomeProduto.includes(termo) || categoriaProduto.includes(termo);
    }

    return cat === "" || cat === "inicio" || categoriaProduto === cat;
  });
}

//mostrar prodtos pos filtro
function mostrarProdutos() {
  const container = document.getElementById("produtos-catalogo");
  if (!container) return;

  const itens = filtrarProdutos();
  if (itens.length === 0) {
    container.innerHTML = `<div class="col-12"><p class="text-center text-muted">Nenhum produto encontrado para o filtro e/ou categoria atual.</p></div>`;
    return;
  }

  let html = "";
  itens.forEach((item) => {
    const precoFormatado = item.vlProduto.toFixed(2);
    html += `
      <div class="col-md-4 mb-4 roleCard" data-categoria="${item.categoria.toLowerCase()}">
        <div class="card h-100">
          <img src="${item.imagem}" alt="${item.nmProduto}" class="card-img">
          <div class="card-body d-flex flex-column">
            <span class="badge badge-secondary mt-2 mb-2" style="background-color:#99A1AF">${item.categoria
      }</span>
            <h5 class="card-title">${item.nmProduto}</h5>
            <!-- Avaliação -->
            <div class="mb-3">
              <span class="text-warning">★★★★☆</span>
              <small class="text-muted ms-2">4.8 (127 avaliações)</small>
            </div>
            
            <p class="fw-bold" style="color:#C27AFF">R$ ${precoFormatado.replace(
        ".",
        ","
      )}</p>
            <div class="mt-auto">
              <button class="botao-card btn w-100" data-bs-toggle="modal" data-bs-target="#cardModal-${item.cdProduto
      }">
                Adicionar ao pedido
              </button>
            </div>
          </div>
        </div>
      </div>

<div class="modal fade" id="cardModal-${item.cdProduto
      }" tabindex="-1" aria-labelledby="cardModalLabel-${item.cdProduto
      }" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg">
      <div class="modal-header border-0 pb-0">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
      </div>
      <div class="modal-body px-4 pt-0">
        <div class="row">
          <!-- Imagem do Produto -->
          <div class="col-3 mb-3">
            <img src="${item.imagem}" class="img-fluid rounded" alt="${item.nmProduto
      }" style="max-height: 100px; object-fit: cover;">
          </div>

          <div class="col mb-3">
                  <h5 class="fw-bold mb-2">${item.nmProduto}</h5>
                    <!-- Tag de categoria/tipo -->
                   ${item.categoria
        ? `<span class="badge rounded-pill badge-secondary " style="background-color:#99A1AF">${item.categoria}</span>`
        : ""
      }
          </div>
          
          <!-- Informações do Produto -->
          <div class="col-md-7">  
            <!-- Preço -->
            <div class="mb-3">
              <h3 class="fw-bold mb-0 price" style="color:#C27AFF">R$ ${precoFormatado.replace(
        ".",
        ","
      )}</h3>
            </div>
            
            <!-- Avaliação -->
            <div class="mb-3">
              <span class="text-warning">★★★★☆</span>
              <small class="text-muted ms-2">4.8 (127 avaliações)</small>
            </div>
            
            <!-- Título da descrição -->
            <h6 class="fw-bold mb-2">Descrição</h6>
            <p class="text-muted small mb-4">${item.dsProduto}</p>
            
          </div>
        </div>
      </div>
      
      <!-- Rodapé com botão -->
      <div class="modal-footer border-0 pt-0 px-4 pb-4">
        <button class="botao-modal btn w-100 py-3 fw-bold btnAddCarrinho"
          data-cd="${item.cdProduto}"
          data-nome="${item.nmProduto}"
          data-valor="${item.vlProduto}"
          data-categoria="${item.categoria}"
          data-imagem="${item.imagem}">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  </div>
</div>
    
    `;
  });

  container.innerHTML = html;
}

//fetch aqui
export async function inicializarCatalogo() {
  const container = document.getElementById("produtos-catalogo");

  if(container){
    container.innerHTML = `<div class="col-12"><p class="text-center text-primary">Carregando produtos...</p></div>`;
  }

  try {
    const dados = await fetchData(url);
    listaProdutosBancoDeDados = dados;
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    if (container) {
      container.innerHTML = `<div class="col-12"><p class="text-center text-danger">Erro ao carregar produtos: ${err.message}. Verifique o servidor.</p></div>`;
    }
    return;
  
  }
  mostrarProdutos();

  linksCategoria.forEach((link) => {
    if (link.textContent.trim() === "Inicio" && !link.dataset.categoria) {
      link.dataset.categoria = "inicio";
    }

    link.addEventListener("click", (e) => {
      e.preventDefault();

      const categoriaSel = link.dataset.categoria;

      atualizarEstiloAtivo(link);
      setCategoriaAtiva(categoriaSel);
    });
  });

  const linkInicio = document.querySelector('[data-categoria="inicio"]');
  if (linkInicio) atualizarEstiloAtivo(linkInicio);

}

//carrinho
let carrinho = [];

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregarCarrinho() {
  const salvo = localStorage.getItem("carrinho");
  carrinho = salvo ? JSON.parse(salvo) : [];
}

function abrirOffcanvasCarrinho() {
  const el = document.getElementById("offcanvasCarrinho");
  if (!el || !window.bootstrap?.Offcanvas) return;
  const off = bootstrap.Offcanvas.getOrCreateInstance(el);
  off.show();
}

function fecharModal(botao) {
  const modalEl = botao.closest(".modal");
  if (!modalEl || !window.bootstrap?.Modal) return;
  const modal =
    bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modal.hide();
}

function atualizaCarrinho() {
  const container = document.getElementById("itensCarrinho");
  const contadorItens = document.getElementById("contadorItens");
  const subtotalSpan = document.getElementById("subtotal");

  if (!container) return;

  let total = 0;
  let contador = 0;

  if (carrinho.length === 0) {
    container.innerHTML = `<p class="text-muted">Seu carrinho está vazio</p>`;
    contadorItens.textContent = `0 itens no carrinho`;
    subtotalSpan.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    salvarCarrinho();
    return;
  }


  let html = "";

  carrinho.forEach((item) => {
    const subtotal = Number(item.vlProduto) * Number(item.quantidade);
    contador += Number(item.quantidade);
    total += subtotal;

    html += `
    <div class="card mb-3 border">
                <button type="button" class="btn-close position-absolute top-0 end-0 m-2" onclick="removeItem(${item.cdProduto
      })" aria-label="Remover item"></button>
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <img src="${item.imagem}" alt="${item.nmProduto
      }" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${item.nmProduto}</h6>
                            <p class="text-muted small mb-2 badge badge-secondary" style="background-color:#99A1AF">${item.categoria ?? ""
      }</p>
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="btn-group btn-group-sm" role="group">
    <button type="button" class="btn btn-outline-secondary" onclick="decrementar(${item.cdProduto
      })">−</button>
    <input type="text" class="form-control text-center" min="1" value="${item.quantidade
      }" style="max-width: 50px;" readonly>
    <button type="button" class="btn btn-outline-secondary" onclick="incrementar(${item.cdProduto
      })">+</button>
</div>
                                <span class="fw-bold" style="color: #9b59b6;">R$ ${Number(
        item.vlProduto
      ).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
  });

  container.innerHTML = html;
  subtotalSpan.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  contadorItens.textContent = ` ${contador} itens no carrinho`;

  salvarCarrinho();
}

function adicionarAoCarrinho(
  cdProduto,
  nmProduto,
  vlProduto,
  categoria,
  imagem
) {
  const existe = carrinho.find((i) => i.cdProduto === cdProduto);
  if (existe) {
    existe.quantidade += 1;
  } else {
    carrinho.push({
      cdProduto: cdProduto,
      nmProduto: nmProduto,
      vlProduto: vlProduto,
      categoria: categoria,
      imagem: imagem,
      quantidade: 1,
    });
  }
  atualizaCarrinho();
}

// Função para decrementar quantidade
window.decrementar = function (cdProduto) {
  const item = carrinho.find((i) => i.cdProduto === cdProduto);
  if (!item) return;
  if (item.quantidade > 1) {
    item.quantidade -= 1;
  }

  atualizaCarrinho();
  salvarCarrinho();
};

// Função para incrementar quantidade
window.incrementar = function (cdProduto) {
  const item = carrinho.find((i) => i.cdProduto === cdProduto);
  if (!item) return;

  item.quantidade += 1;

  atualizaCarrinho();
  salvarCarrinho();
};

window.mudarQuantidade = function (cdProduto, novaQuantidade) {
  const item = carrinho.find((i) => i.cdProduto === cdProduto);
  if (!item) return;
  const q = parseInt(novaQuantidade, 10);
  item.quantidade = isNaN(q) || q < 1 ? 1 : q;
  atualizaCarrinho();
  salvarCarrinho();
};


window.removeItem = function (cdProduto) {
  carrinho = carrinho.filter((i) => i.cdProduto !== cdProduto);
  atualizaCarrinho();
  salvarCarrinho();
};

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btnAddCarrinho");
  if (!btn) return;

  const cdProduto = parseInt(btn.dataset.cd, 10);
  const nmProduto = btn.dataset.nome;
  const vlProduto = parseFloat(String(btn.dataset.valor).replace(",", "."));
  const categoria = btn.dataset.categoria;
  const imagem = btn.dataset.imagem;

  adicionarAoCarrinho(cdProduto, nmProduto, vlProduto, categoria, imagem);
  fecharModal(btn);
  abrirOffcanvasCarrinho();
});

document.addEventListener("DOMContentLoaded", () => {
  inicializarCatalogo?.(setCategoriaAtiva);
  mostrarProdutos();

  carregarCarrinho();
  atualizaCarrinho();

  const btnLimpar = document.getElementById("btLimpar");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", function () {
      carrinho = [];
      salvarCarrinho();
      atualizaCarrinho();
    });
  }
});
