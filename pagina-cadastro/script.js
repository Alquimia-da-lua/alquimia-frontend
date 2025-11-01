//jude: funcao p/ pegar dados de usuario
function dadosUsuario() {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) {
    return null;
  }
  try {
    const dados = JSON.parse(usuario);
    return dados && dados.token ? dados : null;
  } catch (e) {
    return null;
  }
}

//jude: funcao p/ determinar modo de edicao
function isModoEdicao() {
  const params = new URLSearchParams(window.location.search);
  return params.get("modo") === "edicao";
}

//jude: funcao logout
function logoutUsuario() {
  localStorage.removeItem("usuario");
  window.location.href = "../pagina-principal/index.html";
}

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

//jude: ids da interface p/ manipular
const tituloPagina = document.getElementById("titulo-cadastro");
const grupoSenha = document.getElementById("grupo-senha");
const grupoConfirmarSenha = document.getElementById("grupo-confirmar-senha");
const grupoCpf = document.getElementById("grupo-cpf");
const grupoLogout = document.getElementById("grupoLogout");
const grupoLogin = document.getElementById("grupoLogin");
const teste = document.getElementById("teste");

//jude: definindo modo edicao
const modoEdicao = isModoEdicao();
const dadosUsuarioLogado = dadosUsuario();

console.log("MODO EDIÇÃO ATIVO?", modoEdicao);
console.log("DADOS DO USUÁRIO:", dadosUsuarioLogado);

if (modoEdicao) {
  if (!dadosUsuarioLogado) {
    window.location.href = "../pagina-login/index.html";
  } else {
    if (tituloPagina) {
      tituloPagina.textContent = "Atualizar Meu Cadastro";
    }
    if (botaoCadastrar) {
      botaoCadastrar.textContent = "Salvar Alterações";
    }
    //jude: visibilidade do rodape
    if (grupoLogin) grupoLogin.classList.add("d-none"); //tira o link de login
    if (grupoLogout) grupoLogout.classList.remove("d-none"); // mostra o link de logout
    teste.classList.add("d-none");

    nomeUsuario.value = dadosUsuarioLogado.nome || "";
    email.value = dadosUsuarioLogado.email || "";
    telefone.value = dadosUsuarioLogado.telefone || "";

    if (grupoSenha) grupoSenha.style.display = "none";
    if (grupoConfirmarSenha) grupoConfirmarSenha.style.display = "none";
    if (grupoCpf) grupoCpf.style.display = "none";

    if (cpf) {
      cpf.value = dadosUsuarioLogado.cpf || "";
      cpf.disabled = true;
    }
  }
}

//valida nome
function validarNome() {
  const valorNome = nomeUsuario.value.trim();
  const isNomeValido =
    /^[A-Za-zÀ-ÖØ-öø-ÿĀ-žḀ-ỹ ]+$/.test(valorNome) && valorNome.length >= 3;

  // verifica quantos espacos tem no nome
  const partesNome = valorNome.split(" ").filter((parte) => parte.length > 0);

  if (isNomeValido && partesNome.length > 1) {
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
  //jude
  if (modoEdicao) return true;

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
  //jude
  if (modoEdicao) return true;

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

  if (!modoEdicao) {
    if (cpfValido) {
      cpf.classList.remove("bg-danger");
      feedbackCpf.classList.add("d-none");
    } else {
      cpf.classList.add("bg-danger");
      feedbackCpf.classList.remove("d-none");
    }
  }

  let formValido;

  if (modoEdicao) {
    formValido = nomeValido && emailValido && telefoneValido;
  } else {
    formValido =
      nomeValido && emailValido && senhaValida && cpfValido && telefoneValido;
  }

  botaoCadastrar.disabled = !formValido;
}

// desativa o botao se qualquer um for falso
/*botaoCadastrar.disabled = !(
  nomeValido &&
  emailValido &&
  senhaValida &&
  cpfValido &&
  telefoneValido
);*/

//jude: mudancar para modo edicao
nomeUsuario.addEventListener("input", atualizarEstadoBotao);
email.addEventListener("input", atualizarEstadoBotao);

if (!modoEdicao) {
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

  const inputSenha = document.querySelector("#senhaUsuario");
  const inputConfirmarSenha = document.querySelector("#confirmarSenha");
  const button = document.querySelector("#verSenha");
  if (button) button.addEventListener("click", verSenha);
}

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

//jude: botao sair
const botaoSairPerfil = document.getElementById("botaoSairPerfil");

if (botaoSairPerfil) {
  botaoSairPerfil.addEventListener("click", (event) => {
    event.preventDefault();
    logoutUsuario();
  });
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
const apiUrl = "http://localhost:8084/auth/register";

form.addEventListener("submit", function (event) {
  event.preventDefault();
  //jude: alterei aqui
  const nmUsuario = nomeUsuario.value.trim();
  const emailUsuario = email.value.trim();
  const senhaUsuarioVal = senhaUsuario.value;
  const nuTelefone = telefone.value.trim();
  const nuCpf = cpf.value.trim();

  // limpa telefone e cpf
  const telefoneLimpo = nuTelefone.replace(/\D/g, "");
  const cpfLimpo = nuCpf.replace(/\D/g, "");

  //jude: variaveis para modo edicao:
  let finalApiUrl;
  let finalMethod;
  let finalPayload;
  let finalHeaders = { "Content-Type": "application/json" };

  if (modoEdicao && dadosUsuarioLogado) {
    finalApiUrl = `http://localhost:8084/api/usuario/atualizar/${dadosUsuarioLogado.cdUsuario}`;
    finalMethod = "PUT";

    let payloadEdicao = {
      nmUsuario: nmUsuario,
      nuTelefone: telefoneLimpo,
    };

    if (emailUsuario !== dadosUsuarioLogado.email) {
      payloadEdicao.emailUsuario = emailUsuario;
    }

    finalPayload = payloadEdicao;

    finalHeaders["Authorization"] = `Bearer ${dadosUsuarioLogado.token}`;
  } else {
    if (
      !(
        nmUsuario &&
        emailUsuario &&
        senhaUsuarioVal &&
        telefoneLimpo &&
        cpfLimpo
      )
    ) {
      return;
    }

    finalApiUrl = "http://localhost:8084/auth/register";
    finalMethod = "POST";

    finalPayload = {
      nmUsuario: nmUsuario,
      emailUsuario: emailUsuario,
      senhaUsuario: senhaUsuarioVal,
      nuTelefone: telefoneLimpo,
      nuCpf: cpfLimpo,
    };
  }

  fetch(finalApiUrl, {
    method: finalMethod,
    headers: finalHeaders,
    body: JSON.stringify(finalPayload),
  })
    .then(async (response) => {
      const resposta = await response.json().catch(() => ({}));

      if (response.ok) {
        toastSucesso();

        if (modoEdicao) {
          const novoUsuario = {
            ...dadosUsuarioLogado,
            nome: finalPayload.nmUsuario,
            email: finalPayload.emailUsuario || dadosUsuarioLogado.email,
            telefone: finalPayload.nuTelefone,
          };
          localStorage.setItem("usuario", JSON.stringify(novoUsuario));

          setTimeout(() => {
            window.location.href = "../pagina-principal/index.html";
          }, 800);
        } else {
          form.reset();
        }
        return resposta;
      } else {
        // Trata erros de Cadastro
        if (!modoEdicao && resposta && resposta.erro) {
          const mensagemErro = resposta.erro;
          if (mensagemErro.includes("Email")) {
            toastErroEmail();
          } else if (mensagemErro.includes("CPF")) {
            toastErroCpf();
          }
        } else {
          console.error(`Erro: ${response.status}`, resposta);
        }
      }
    })
    .catch((error) => {
      console.error(`Erro: ${error.message}`);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  atualizarEstadoBotao();
});
