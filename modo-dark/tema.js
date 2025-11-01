const botaoTema = document.getElementById("mudaTema");
const iconeTema = botaoTema ? botaoTema.querySelector(".icon-dark-mode") : null;
const iconeUser = document.querySelector(".icon-user");
const iconeCart = document.querySelector(".icon-carrinho");
const iconeBag = document.querySelector(".icon-sacola");
const iconeLupa = document.querySelector(".icon-lupa");
const imgManutencao = document.querySelector(".img-manutencao");
const htmlElement = document.documentElement;

let temaEscuro = false;
const CHAVE_STORAGE = "alquimia-tema";
const ICONE_PRETO = "../images/icon/night-mode-dark.png";
const ICONE_BRANCO = "../images/icon/night-mode-light.png";
const USER_BRANCO = "../images/icon/user-branco.png";
const USER_PRETO = "../images/icon/user-preto.png";
const CART_BRANCO = "../images/icon/shopping-cart-branco.png";
const CART_PRETO = "../images/icon/shopping-cart-preto.png";
const MANUTENCAO_PRETO = "../images/diversos/pg-em-manutencao.png";
const MANUTENCAO_BRANCO = "../images/diversos/pg-em-manutencao-dark.png";
const SACOLA_BRANCO = "../images/icon/sacola-branca.png";
const SACOLA_PRETO = "../images/icon/sacola-preta.png";
const LUPA_BRANCO = "../images/icon/lupa-preta.png";
const LUPA_PRETO = "../images/icon/lupa.png";

function aplicarTema() {
  if (!htmlElement) return;

  if (temaEscuro) {
    htmlElement.setAttribute("data-bs-theme", "dark");

    if (iconeTema) {
      iconeTema.src = ICONE_BRANCO;
      iconeTema.alt = "icone lightmode";
    }

    if (iconeUser) {
      iconeUser.src = USER_BRANCO;
      iconeUser.alt = "icone user claro";
    }

    if (iconeCart) {
      iconeCart.src = CART_BRANCO;
      iconeCart.alt = "icone carrinho claro";
    }

    if (imgManutencao) {
      imgManutencao.src = MANUTENCAO_BRANCO;
      imgManutencao.alt = "Caldeirão com tubos de ensaio e robo de madeira tema claro";
    }

    if (iconeBag) {
      iconeBag.src = SACOLA_BRANCO;
      iconeBag.alt = "icone de sacola claro";
    }

    if (iconeLupa) {
      iconeLupa.src = LUPA_BRANCO;
      iconeLupa.alt = "icone de lupa claro";
    }
    
  } else {
    htmlElement.setAttribute("data-bs-theme", "light");
    
    if (iconeTema) {
      iconeTema.src = ICONE_PRETO;
      iconeTema.alt = "icone darkmode";
    }
    
    if (iconeUser) {
      iconeUser.src = USER_PRETO;
      iconeUser.alt = "icone user preto";
    }
    
    if (iconeCart) {
      iconeCart.src = CART_PRETO;
      iconeCart.alt = "icone carrinho preto";
    }
    
    if (imgManutencao) {
      imgManutencao.src = MANUTENCAO_PRETO;
      imgManutencao.alt = "Caldeirão com tubos de ensaio e robo de madeira tema escuro";
    }
    
    if (iconeBag) {
      iconeBag.src = SACOLA_PRETO;
      iconeBag.alt = "icone de sacola preto";
    }
    
        if (iconeLupa) {
          iconeLupa.src = LUPA_PRETO;
          iconeLupa.alt = "icone de lupa preto";
        }
  }
}

function salvarTema() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(temaEscuro));
}

function initTheme() {
  const temaSalvo = localStorage.getItem(CHAVE_STORAGE);

  if (temaSalvo !== null) {
    temaEscuro = JSON.parse(temaSalvo);
  } else {
    temaEscuro =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  aplicarTema();
}

document.addEventListener("DOMContentLoaded", initTheme);

if (botaoTema) {
  botaoTema.addEventListener("click", function () {
    temaEscuro = !temaEscuro;
    aplicarTema();
    salvarTema();
  });
}
