
const botaoTema = document.getElementById("mudaTema"); 
const iconeTema = botaoTema ? botaoTema.querySelector('.icon-dark-mode') : null; 
const iconeUser = document.querySelector('.icon-user');
const iconeCart = document.querySelector('.icon-carrinho');
const htmlElement = document.documentElement; 

let temaEscuro = false;
const CHAVE_STORAGE = "alquimia-tema"; 
const ICONE_PRETO = '../images/icon/night-mode-dark.png'; 
const ICONE_BRANCO = '../images/icon/night-mode-light.png';
const USER_BRANCO = '../images/icon/user-branco.png';
const USER_PRETO = '../images/icon/user-preto.png';
const CART_BRANCO = '../images/icon/shopping-cart-branco.png';
const CART_PRETO = '../images/icon/shopping-cart-preto.png';


function aplicarTema() {
    if (!htmlElement) return;

    if (temaEscuro) {
        htmlElement.setAttribute("data-bs-theme", "dark");
        if (iconeTema) { 
            iconeTema.src = ICONE_BRANCO; 
            iconeTema.alt = "icone lightmode";
            iconeUser.src = USER_BRANCO;
            iconeUser.alt = "icone user claro";
            iconeCart.src = CART_BRANCO;
            iconeCart.alt = "icone carrinho claro";
            
        }
    } else {
        htmlElement.setAttribute("data-bs-theme", "light");
        if (iconeTema) {
            iconeTema.src = ICONE_PRETO; 
            iconeTema.alt = "icone darkmode";
            iconeUser.src = USER_PRETO;
            iconeUser.alt = "icone user preto";
            iconeCart.src = CART_PRETO;
            iconeCart.alt = "icone carrinho preto";
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
        temaEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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