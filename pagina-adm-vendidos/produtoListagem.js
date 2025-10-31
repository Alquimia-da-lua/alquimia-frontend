const API_URL = "http://localhost:8084/api/produto"; 

//Lista os produtos
async function carregarProdutos() {
  try {
    const response = await fetch(`${API_URL}/listar`); 
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    const produtos = await response.json(); 
    renderizarProdutos(produtos);
  } catch (error) {
    console.error("Erro ao carregar os produtos:", error);
    const tbody = document.querySelector("#lista tbody");
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Falha ao carregar produtos.</td></tr>`;
  }
}

function renderizarProdutos(produtos) {
  const tbody = document.querySelector("#lista tbody");
  tbody.innerHTML = ""; 

  // Atualiza a contagem de produtos
  document.querySelector('#lista p.text-muted.small').textContent = 
    `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} cadastrado${produtos.length !== 1 ? 's' : ''}`;

  if (produtos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">Nenhum produto encontrado.</td></tr>`;
    return;
  }

  produtos.forEach((produto) => {
    const produtoId = produto.cdProduto; 
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img
          src="${produto.urlImagem || '../images/produtos/default.png'}"
          alt="${produto.nmProduto}"
          class="rounded"
          style="width: 80px; height: 80px; object-fit: cover"
        />
      </td>
      <td>
        <div class="d-flex flex-column gap-1">
          <span class="fw-semibold">${produto.nmProduto}</span>
          <span class="text-muted small">${produto.dsProduto || 'Sem descrição.'}</span>
        </div>
      </td>
      <td>
        <span class="badge bg-light text-dark rounded-2 px-3 py-2">
          ${produto.categoria}
        </span>
      </td>
      <td>
        <span class="fw-semibold text-primary-purple">
          R$ ${produto.vlProduto ? produto.vlProduto.toFixed(2).replace('.', ',') : '0,00'}
        </span>
      </td>
      <td>
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-secondary btn-sm action-btn edit p-2"
            title="Editar"
            onclick="handleEdit(${produtoId})" 
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
            onclick="handleDelete(${produtoId})" 
          >
            <img
              src="../images/icon/lixo.png"
              alt="Deletar"
              style="width: 1.5rem"
            />
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

//Função para onclick e passsar o id

function handleEdit(produtoId) {
    console.log(`[EDITAR] Produto ID ${produtoId} detectado. Ação de edição a ser implementada.`);
    if (typeof openModalNovoProduto === 'function') {
        openModalNovoProduto();
    }
}

function handleDelete(produtoId) {
    console.log(`[DELETAR] Produto ID ${produtoId} detectado. Ação de exclusão a ser implementada.`);
    if (confirm(`Tem certeza que deseja deletar o produto ID ${produtoId}?`)) {
        alert(`Ação de DELETAR para o ID ${produtoId} registrada. Lógica de FETCH DELETE pendente.`);
    }
}


document.addEventListener("DOMContentLoaded", carregarProdutos);