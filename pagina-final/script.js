let tipoPagamento = "CREDITO";

const inputCep = document.getElementById("cep");
const inputRua = document.getElementById("rua");
const inputNumero = document.getElementById("numero");
const inputComplemento = document.getElementById("complemento");
const inputBairro = document.getElementById("bairro");
const inputCidade = document.getElementById("cidade");

function selecionarPagamento(type) {
  tipoPagamento = type;
  document.querySelectorAll(".payment-option").forEach((option) => {
    option.classList.remove("active");
  });
  event.currentTarget.classList.add("active");

  document.getElementById(type).checked = true;

  const cardDetails = document.getElementById("cardDetails");
  const pixDetails = document.getElementById("pixDetails");
  if (type == "pix") {
    cardDetails.style.display = "none";
    pixDetails.classList.remove("d-none");
  } else {
    cardDetails.style.display = "block";
    pixDetails.classList.add("d-none");
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

function validarFormulario() {
  if (
    !inputCep.value.trim() ||
    !inputRua.value.trim() ||
    !inputBairro.value.trim() ||
    !inputCidade.value.trim()
  ) {
    return alert("Preencha todos os campos obrigatórios do endereço.");
  }
  if (!validarDadosCartao() && tipoPagamento !== "pix") {
    return alert("Preencha todos os campos obrigatórios do cartão.");
  }
  return true;
}

// validar dados do cartao
const cartaoInputs = [
  {
    input: document.getElementById("nuCartao"),
    feedback: document.getElementById("feedback-numero"),
    minLength: 19,
  },
  {
    input: document.getElementById("nmCartao"),
    feedback: document.getElementById("feedback-nome-cartao"),
    tamMininmo: 3,
  },
  {
    input: document.getElementById("vCartao"),
    feedback: document.getElementById("feedback-validade"),
    tamMinimo: 5,
  },
  {
    input: document.getElementById("cvvCartao"),
    feedback: document.getElementById("feedback-cvv"),
    tamMinimo: 3,
  },
];

function validarCampo(campo) {
  if (campo.input.value.trim().length >= campo.tamMinimo) {
    campo.feedback.classList.add("d-none");
    return true;
  } else {
    campo.feedback.classList.remove("d-none");
    return false;
  }
}

function validarDadosCartao() {
  let valido = true;
  for (let campo of cartaoInputs) {
    if (!validarCampo(campo)) {
      valido = false;
      return;
    }
  }
  return valido;
}

// adiciona listeners em tempo real para esconder feedback quando o usuário corrige
cartaoInputs.forEach((campo) => {
  campo.input.addEventListener("input", () => validarCampo(campo));
});

//finalizar compras itens carrinho

document.addEventListener("DOMContentLoaded", () => {
  validarDadosCartao();
  // preencher os dados do usuario com localStorage
  const inputNome = document.getElementById("nmUsuario");
  const inputEmail = document.getElementById("emailUsuario");
  const inputTelefone = document.getElementById("nuTelefone");

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    inputNome.value = usuario.nome;
    inputEmail.value = usuario.email;

    // aplicar mascara no telefone
    let telefoneFormatado = usuario.telefone;
    telefoneFormatado = telefoneFormatado.replace(
      /(\d{2})(\d{4})(\d{4})/,
      "($1) $2-$3"
    );

    inputTelefone.value = telefoneFormatado;
  }

  const keycarrinho = "carrinho";
  let itensCarrinho = [];

  const carrinhoListaLocalStorage = localStorage.getItem(keycarrinho);

  let subtotal = 0;
  const freteUnico = 15;
  let totalPedido = 0;

  if (carrinhoListaLocalStorage) {
    try {
      itensCarrinho = JSON.parse(carrinhoListaLocalStorage);

      if (itensCarrinho && itensCarrinho.length > 0) {
        const containerItens = document.getElementById("product-item");

        let htmlItens = "";

        itensCarrinho.forEach((item) => {
          totalItem = item.vlProduto * item.quantidade;
          subtotal += totalItem;
          totalPedido = totalPedido + totalItem + freteUnico;

          htmlItens += `
            <li class="list-group-item d-flex">
              <img src="${item.imagem}" alt="${item.nmProduto}" class="me-3" style="width:48px;height:48px;object-fit:cover;border-radius:8px;">
              <div class="product-info">
                <div class="product-name me-3">${item.nmProduto}</div>
                <div class="product-qty">Qtd. ${item.quantidade}</div>
              </div>
              <div class="product-price">R$ ${totalItem}</div>
            </li>
            `;
        });

        const containetTotal = document.getElementById("resumo-final");

        containetTotal.innerHTML = `
          <div class="summary-line">
            <span>Subtotal:</span>
            <span>R$ ${subtotal}</span>
          </div>

          <div class="summary-line">
            <span>Frete:</span>
            <span>R$ ${freteUnico}</span>
          </div>
          <div class="summary-line total">
            <span>Total:</span>
            <span class="price">R$ ${totalPedido}</span>
          </div>
          `;

        if (containerItens) {
          containerItens.innerHTML = htmlItens;
        } else {
          console.error("container nao encontrado");
        }
      } else {
        console.error("carrinho vazio");
      }
    } catch (e) {
      console.error("erro no parse do json");
    }
  } else {
    console.log("nenhum dado de carrinho encontrado no localstorage");
  }

  const cdUsuario = JSON.parse(localStorage.getItem("usuario")).cdUsuario;

  // variavel para guardar o estado
  // o estado é obrigatório pra salvar no backend
  // mas nao tem input no front pra isso
  let estado = "";

  // buscando o endereco pelo viacep
  inputCep.addEventListener("input", async function () {
    const cep = inputCep.value.replace(/\D/g, "");
    const apiCep = `https://viacep.com.br/ws/${cep}/json/`;

    if (cep.length === 8) {
      fetch(apiCep, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          const resposta = await response.json();

          if (response.ok) {
            // preencher automaticamente os campos
            inputRua.value = resposta.logradouro || "";
            inputBairro.value = resposta.bairro || "";
            inputCidade.value = resposta.localidade || "";
            estado = resposta.estado;
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar endereço:", error);
          alert("Erro ao buscar endereço!");
        });
    }
  });

  // url api para criar pedido
  const urlPedido = "http://localhost:8084/api/pedido";

  // finalizar compra
  document
    .querySelector(".btn-finalize")
    .addEventListener("click", async () => {
      const cep = inputCep.value.replace(/\D/g, "");
      const rua = inputRua.value.trim();
      const complemento = inputComplemento.value.trim();
      const bairro = inputBairro.value.trim();
      const cidade = inputCidade.value.trim();

      try {
        // validar todos os campos do endereco e pagamento
        if (!validarFormulario()) return;

        // cadastrar endereco
        const enderecoResponse = await fetch(
          `http://localhost:8084/api/usuario/${cdUsuario}/endereco`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${usuario.token}`,
            },
            body: JSON.stringify({
              cdUsuario: cdUsuario,
              nuCep: cep,
              dsLogradouro: rua,
              dsComplemento: complemento,
              dsBairro: bairro,
              dsLocalidade: cidade,
              nmEstado: estado,
            }),
          }
        );

        if (!enderecoResponse.ok) {
          alert("Erro ao cadastrar endereço");
          return;
        }

        // criar pedido
        const pedidoResponse = await fetch(urlPedido, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.token}`,
          },
          body: JSON.stringify({
            cdUsuario: cdUsuario,
            vlPedido: subtotal,
            vlFrete: freteUnico,
            tipoPagamento: tipoPagamento.toUpperCase(),
          }),
        });

        if (pedidoResponse.ok) {
          alert(`Compra finalizada!`);
          localStorage.removeItem("carrinho");
          window.location.href = "../pagina-principal/index.html";
        } else {
          console.error("Erro ao criar pedido");
          alert("Erro ao finalizar a compra.");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro durante a finalização da compra.");
      }
    });
});
