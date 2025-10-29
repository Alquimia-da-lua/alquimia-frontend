// elementos principais
const nomeUsuario = document.getElementById("nmUsuario");
const email = document.getElementById("emailUsuario");
const cpf = document.getElementById("nuCpf");
const telefone = document.getElementById("nuTelefone");
const senhaUsuario = document.getElementById("senhaUsuario");
const confirmarSenha = document.getElementById("confirmarSenha");

// feedbacks
const feedbackNome = document.getElementById("feedback-nome");
const feedbackEmail = document.getElementById("feedback-email");
const feedbackSenha = document.getElementById("feedback-senha");
const feedbackCSenha = document.getElementById("feedback-confirmar-senha");
const feedbackCpf = document.getElementById("feedback-cpf");
const feedbackTelefone = document.getElementById("feedback-telefone");

// formulario
const botaoCadastrar = document.getElementById("criarContaBtn");
const form = document.getElementById("form-cadastro");

//valida nome
function validarNome() {
  const valorNome = nomeUsuario.value.trim();
  const isNomeValido =
    /^[A-Za-zÀ-ÖØ-öø-ÿĀ-žḀ-ỹ ]+$/.test(valorNome) && valorNome.length >= 3;

  if (isNomeValido) {
    nomeUsuario.classList.remove("bg-danger");
    feedbackNome.classList.add("d-none");
  } else {
    nomeUsuario.classList.add("bg-danger");
    feedbackNome.classList.remove("d-none");
  }
  return isNomeValido;
}

// valida email
function validarEmail() {
  const valorEmail = email.value.trim();
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValido = regexEmail.test(valorEmail.toLowerCase());

  if (isEmailValido) {
    email.classList.remove("bg-danger");
    feedbackEmail.classList.add("d-none");
  } else {
    email.classList.add("bg-danger");
    feedbackEmail.classList.remove("d-none");
  }
  return isEmailValido;
}

// valida cpf
function validaCPF(cpf) {
  var soma = 0;
  var resto;
  var strCPF = String(cpf).replace(/[^\d]/g, "");

  if (strCPF.length !== 11) return false;

  if (
    [
      "00000000000",
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999",
    ].includes(strCPF)
  )
    return false;

  for (let i = 1; i <= 9; i++)
    soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(strCPF.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(strCPF.substring(10, 11))) return false;

  return true;
}

// função para validar senha e confirmar senha (ve se a senha tem tamanho minimo e se as senhas sao iguais)
function validarSenhas() {
  const isTamanhoValido = senhaUsuario.value.length >= 8;
  const senhasIguais =
    senhaUsuario.value === confirmarSenha.value &&
    confirmarSenha.value.length > 0;

  // feedback tamanho
  if (isTamanhoValido) {
    senhaUsuario.classList.remove("bg-danger");
    feedbackSenha.classList.add("d-none");
  } else {
    senhaUsuario.classList.add("bg-danger");
    feedbackSenha.classList.remove("d-none");
  }

  // feedback confirmação
  if (senhasIguais) {
    confirmarSenha.classList.remove("bg-danger");
    feedbackCSenha.classList.add("d-none");
  } else {
    confirmarSenha.classList.add("bg-danger");
    feedbackCSenha.classList.remove("d-none");
  }

  return isTamanhoValido && senhasIguais;
}

// função validar telefone
function validarTelefone(numero) {
  const numeroLimpo = numero.replace(/\D/g, "");

  if (numeroLimpo.length === 11) {
    telefone.classList.remove("bg-danger");
    feedbackTelefone.classList.add("d-none");
    return true;
  } else {
    telefone.classList.add("bg-danger");
    feedbackTelefone.classList.remove("d-none");
    return false;
  }
}

// funcao para habilitar/desabilitar o botão
function atualizarEstadoBotao() {
  const nomeValido = validarNome();
  const senhaValida = validarSenhas();
  const cpfValido = validaCPF(cpf.value);
  const telefoneValido = validarTelefone(telefone.value);
  const emailValido = validarEmail();

  if (cpfValido) {
    cpf.classList.remove("bg-danger");
    feedbackCpf.classList.add("d-none");
  } else {
    cpf.classList.add("bg-danger");
    feedbackCpf.classList.remove("d-none");
  }

  // desativa o botao se qualquer um for falso
  botaoCadastrar.disabled = !(
    nomeValido &&
    emailValido &&
    senhaValida &&
    cpfValido &&
    telefoneValido
  );
}

//
nomeUsuario.addEventListener("input", atualizarEstadoBotao);
email.addEventListener("input", atualizarEstadoBotao);
senhaUsuario.addEventListener("input", atualizarEstadoBotao);
confirmarSenha.addEventListener("input", atualizarEstadoBotao);

cpf.addEventListener("input", () => {
  // adiciona pontos e traços no CPF enquanto digita
  let value = cpf.value;
  let cpfPattern = value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
  cpf.value = cpfPattern;
  atualizarEstadoBotao();
});

telefone.addEventListener("input", (event) => {
  // formata telefone enquanto digita
  let inputValue = event.target.value.replace(/\D/g, "");
  inputValue = inputValue.substring(0, 11);
  if (inputValue.length > 10) {
    inputValue = inputValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (inputValue.length > 6) {
    inputValue = inputValue.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (inputValue.length > 2) {
    inputValue = inputValue.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  }
  event.target.value = inputValue;
  atualizarEstadoBotao();
});

// mostrar / ocultar senha
const inputSenha = document.querySelector("#senhaUsuario");
const inputConfirmarSenha = document.querySelector("#confirmarSenha");
const button = document.querySelector("#verSenha");
button.addEventListener("click", verSenha);

function verSenha() {
  if (
    inputSenha.type === "password" &&
    inputConfirmarSenha.type === "password"
  ) {
    inputSenha.type = "text";
    inputConfirmarSenha.type = "text";
  } else {
    inputSenha.type = "password";
    inputConfirmarSenha.type = "password";
  }
}

// toasts
function toastSucesso() {
  var toastEl = document.getElementById("toastSucesso");
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function toastErroEmail() {
  var toastEl = document.getElementById("toastErroEmail");
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function toastErroCpf() {
  var toastEl = document.getElementById("toastErroCpf");
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// envio do formulario
const apiUrl = "http://localhost:8084/api/usuario/cadastrar";

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nmUsuario = document.getElementById("nmUsuario").value.trim();
  const emailUsuario = document.getElementById("emailUsuario").value.trim();
  const senhaUsuarioVal = document.getElementById("senhaUsuario").value;
  const nuTelefone = document.getElementById("nuTelefone").value.trim();
  const nuCpf = document.getElementById("nuCpf").value.trim();

  // limpa telefone e cpf
  const telefoneLimpo = nuTelefone.replace(/\D/g, "");
  const cpfLimpo = nuCpf.replace(/\D/g, "");

  if (
    nmUsuario &&
    emailUsuario &&
    senhaUsuarioVal &&
    telefoneLimpo &&
    cpfLimpo
  ) {
    const payload = {
      nmUsuario: nmUsuario,
      emailUsuario: emailUsuario,
      senhaUsuario: senhaUsuarioVal,
      nuTelefone: telefoneLimpo,
      nuCpf: cpfLimpo,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const resposta = await response.json();

        if (response.ok) {
          toastSucesso();
          form.reset();
          return resposta;
        } else {
          const mensagemErro = resposta.message;

          if (mensagemErro.includes("Email")) {
            toastErroEmail();
          } else if (mensagemErro.includes("CPF")) {
            toastErroCpf();
          }
        }
      })
      .catch((error) => {
        console.error(`Erro: ${error.message}`);
      });
  }
});
