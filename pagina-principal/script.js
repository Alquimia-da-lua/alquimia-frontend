import { produtos } from "./produtos.js";
import { inicializarCatalogo } from "./produtos.js";

/*quando a pagina inicia*/ 
document.addEventListener("DOMContentLoaded", () => {
    mostrarProdutos();
})

/*input de busca*/

let termoBusca = "";
const buscaInput = document.getElementById("buscaInput");

 

buscaInput.addEventListener("input", function(){
    const accordionCollapse = document.querySelector("#collapseOne");
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(accordionCollapse); //api bootstrap p/ fechar suave
    bsCollapse.hide(); // ← fecha com animação suave

    if(this.value ===""){
        bsCollapse.show();
    }

    termoBusca = this.value;
    mostrarProdutos();

});

function filtrarProdutos(){
    return produtos.filter((produto) => {
        const matchBusca = 
            produto.nmProduto.toLowerCase().includes(termoBusca.toLowerCase()) ||
            produto.categoria.toLowerCase().includes(termoBusca.toLowerCase());
        return matchBusca;
    });
}


function mostrarProdutos(){
    const container = document.getElementById("produtos-catalogo");

    const produtosFiltrados = filtrarProdutos();

    if ((produtosFiltrados).length === 0) {
        container.innerHTML = "";
    
    } else {
        let html = "";

        produtosFiltrados.forEach(produto => {
        html += `
            <div class="col-md-4 mb-4 roleCard" data-categoria="${produto.categoria}">
                <div class="card h-100">
                    <img src="${produto.imagem}" alt="${produto.nmProduto}" style="" class="card-img">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${produto.nmProduto}</h5>
                        <p class="card-text">${produto.dsProduto}</p>
                        <p class="fw-bold">R$ ${produto.vlProduto}</p>
                        <div class="mt-auto">
                            <button class="botao-card btn w-100" data-bs-toggle="modal" data-bs-target="#cardModal-${produto.cdProduto}">Adicionar ao pedido</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="cardModal-${produto.cdProduto}" tabindex="-1" aria-labelledby="cardModalLabel-${produto.cdProduto}" aria-hidden="true">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="cardModalLabel-${produto.cdProduto}">${produto.nmProduto}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div class="modal-body">
                            <img id="modalImagem-${produto.cdProduto}" src="${produto.imagem}" class="img-fluid rounded mb-3" alt="Imagem do Produto">
                            <p>${produto.dsProduto}</p>
                            <strong>R$${produto.vlProduto}</strong><br>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="botao-modal btn btnAddCarrinho"
                                data-id="${produto.cdProduto}"
                                data-nome = "${produto.nmProduto}"
                                data-valor = "${produto.vlProduto}">
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
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarProdutosAleatorios("produtos-catalogo", 8);
})

document.addEventListener("DOMContentLoaded", () => {
    inicializarCatalogo();
});
