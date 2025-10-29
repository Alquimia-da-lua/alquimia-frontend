import { produtos } from "./produtos.js";

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
    // categoriaAtiva = ""; 
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

function filtrarProdutos() {
  const termo = termoBusca.toLowerCase();
  const cat = categoriaAtiva.toLowerCase();

  return produtos.filter((produto) => {
    const categoriaProduto = produto.categoria.toLowerCase();
    const nomeProduto = produto.nmProduto.toLowerCase();

    if(termo !==""){
      return nomeProduto.includes(termo) || categoriaProduto.includes(termo);
    }

    return cat === "" || cat === "inicio" || categoriaProduto === cat;
    // const matchBusca =
    //   termo === "" ||
    //   produto.nmProduto.toLowerCase().includes(termo) ||
    //   categoriaProduto.includes(termo);

    // const matchCategoria =
    //   cat === "" || cat === "inicio" || categoriaProduto === cat;
    // return matchBusca && matchCategoria;
  });
}

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
            <span class="badge badge-secondary mt-2 mb-2" style="background-color:#99A1AF">${
              item.categoria
            }</span>
            <h5 class="card-title">${item.nmProduto}</h5>
            
            <p class="fw-bold" style="color:#C27AFF">R$ ${precoFormatado.replace(
              ".",
              ","
            )}</p>
            <div class="mt-auto">
              <button class="botao-card btn w-100" data-bs-toggle="modal" data-bs-target="#cardModal-${
                item.cdProduto
              }">
                Adicionar ao pedido
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="cardModal-${
        item.cdProduto
      }" tabindex="-1" aria-labelledby="cardModalLabel-${
      item.cdProduto
    }" aria-hidden="true">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="cardModalLabel-${item.cdProduto}">${
      item.nmProduto
    }</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
            </div>
            <div class="modal-body">
              <img src="${
                item.imagem
              }" class="img-fluid rounded mb-3" alt="Imagem do Produto">
              <p>${item.dsProduto}</p> <strong>R$ ${precoFormatado.replace(
      ".",
      ","
    )}</strong>
            </div>
            <div class="modal-footer">
              <button class="botao-modal btn btnAddCarrinho"
                data-cd="${item.cdProduto}"
                data-nome="${item.nmProduto}"
                data-valor="${item.vlProduto}"
                data-categoria="${item.categoria}"
                data-imagem="${item.imagem}">
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

export function inicializarCatalogo() {
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
  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = `<p class="text-muted">Seu carrinho está vazio</p>`;
    salvarCarrinho();
    return;
  }

  let total = 0;
  let html = "";

  carrinho.forEach((item) => {
    const subtotal = Number(item.vlProduto) * Number(item.quantidade);
    total += subtotal;

    html += `
        <div class="item-carrinho d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center" style="gap:.75rem;">
                <img src="${item.imagem}" alt="${
      item.nmProduto
    }" style="width:48px;height:48px;object-fit:cover;border-radius:8px;">
                <div>   
                    <span class="badge badge-secondary mt-2 mb-2" style="background-color:#99A1AF">${
                      item.categoria ?? ""
                    }</span><br>
                    <strong>${item.nmProduto}</strong><br>
                    R$ ${Number(item.vlProduto).toFixed(2)} x
                    <input type="number" min="1" value="${item.quantidade}"
                        class="form-control form-control-sm d-inline-block"
                        style="width:70px"
                        onchange="mudarQuantidade(${
                          item.cdProduto
                        }, this.value)">
                </div>
                </div>
                <div>
                R$ ${subtotal.toFixed(2)}
                <button class="btn btn-sm btn-danger" onclick="removeItem(${
                  item.cdProduto
                })">Remover</button>
            </div>
        </div>
`;
  });

  html += `
    <hr>
    <div class="total d-flex justify-content-between fw-bold">
      <span>Total:</span>
      <span>R$ ${total.toFixed(2)}</span>
    </div>
  `;

  container.innerHTML = html;
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
