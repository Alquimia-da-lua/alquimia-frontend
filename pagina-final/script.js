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

  //finalizar compras itens carrinho

  document.addEventListener("DOMContentLoaded", () =>{
    const keycarrinho = 'carrinho';
    let itensCarrinho = [];

    const carrinhoListaLocalStorage = localStorage.getItem(keycarrinho);

    if(carrinhoListaLocalStorage){
      try{
        itensCarrinho = JSON.parse(carrinhoListaLocalStorage);

        if(itensCarrinho && itensCarrinho.length > 0){
          const containerItens = document.getElementById("product-item")

          let htmlItens = '';
          let totalPedido = 0;
          let subtotal = 0;
          const freteUnico = 15;

          itensCarrinho.forEach(item => {

            totalItem = item.vlProduto * item.quantidade
            subtotal += totalItem;          
            totalPedido = totalPedido + totalItem + freteUnico;

            htmlItens += `
            <li class="list-group-item d-flex">
              <img src="../images/produtos/pele/oleo_corporal_amendoas.png" alt="Produto" class="product-image me-3">
              <div class="product-info">
                <div class="product-name me-3">${item.nmProduto}</div>
                <div class="product-qty">Qtd. ${item.quantidade}</div>
              </div>
              <div class="product-price">R$ ${totalItem}</div>
            </li>
            `;

          })

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
          `


          if(containerItens){
            containerItens.innerHTML = htmlItens;
          }else{
            console.error("container nao encontrado")
          }
        }else{
          console.error("carrinho vazio")
        }
      }catch(e){
        console.error("erro no parse do json")
      }
    }else{
      console.log('nenhum dado de carrinho encontrado no localstorage')
    }

  });

