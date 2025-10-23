// funcao para para validar se senha e confirmacao de senha sao iguais e tamanho minimo
function validarSenhas() {
  const senhaUsuario = document.getElementById("senhaUsuario");
  const confirmarSenha = document.getElementById("confirmarSenha");
  const feedback = document.getElementById("feedback");
  const feedbackConfirm = document.getElementById("feedback-confirm");

  senhaUsuario.addEventListener("input", () => {
    const isTamanhoValido = senhaUsuario.value.length >= 8;

    if (isTamanhoValido) {
      senhaUsuario.classList.remove("bg-danger");
      feedback.classList.add("d-none");
    } else {
      feedback.classList.remove("d-none");
      senhaUsuario.classList.add("bg-danger");
    }
  });

  confirmarSenha.addEventListener("input", () => {
    const senhasIguais = senhaUsuario.value === confirmarSenha.value;

    if (senhasIguais) {
      confirmarSenha.classList.remove("bg-danger");
      confirmarSenha.classList.add("bg-success");
      feedbackConfirm.classList.add("d-none");
    } else {
      feedbackConfirm.classList.remove("d-none");
      confirmarSenha.classList.remove("bg-success");
      confirmarSenha.classList.add("bg-danger");
    }
  });
}

// funcao para validar cpf e mostrar feedback
function validaCPF(cpf) {
  var Soma = 0;
  var Resto;

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
    ].indexOf(strCPF) !== -1
  )
    return false;

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;

  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(10, 11))) return false;

  return true;
}

const cpf = document.getElementById("nuCpf");
const feedbackCpf = document.getElementById("feedback-cpf");
cpf.addEventListener("input", () => {
  const cpfValido = validaCPF(cpf.value);

  if (cpfValido) {
    cpf.classList.remove("bg-danger");
    feedbackCpf.classList.add("d-none");
  } else {
    feedbackCpf.classList.remove("d-none");
    cpf.classList.add("bg-danger");
  }
});

// funcao para conseguir ver a senha e confirmar senha
const inputSenha = document.querySelector("#senhaUsuario");
const inputConfirmarSenha = document.querySelector("#confirmarSenha");
const button = document.querySelector("#verSenha");
button.addEventListener("click", verSenha);

function verSenha() {
  if (inputSenha.type == "password" && inputConfirmarSenha.type == "password") {
    inputSenha.type = "text";
    inputConfirmarSenha.type = "text";
  } else {
    inputSenha.type = "password";
    inputConfirmarSenha.type = "password";
  }
}

// funcao para adicionar ponto e traco no cpf a hora de digitar
function mascara(i) {
  var v = i.value;

  if (isNaN(v[v.length - 1])) {
    // impede entrar outro caractere que não seja número
    i.value = v.substring(0, v.length - 1);
    return;
  }

  i.setAttribute("maxlength", "14");
  if (v.length == 3 || v.length == 7) i.value += ".";
  if (v.length == 11) i.value += "-";
}

// funcao para adicionar formato de telefone ao digitar
document
  .getElementById("nuTelefone")
  .addEventListener("input", function (event) {
    let inputValue = event.target.value.replace(/\D/g, ""); // remove caracteres nao numericos
    inputValue = inputValue.substring(0, 11); // limita a 11 caracteres (9 digitos + 2 pontos)

    if (inputValue.length > 10) {
      inputValue = inputValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (inputValue.length > 6) {
      inputValue = inputValue.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (inputValue.length > 2) {
      inputValue = inputValue.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }

    event.target.value = inputValue;
  });

// envio do formulario para o backend (nao finalizado)
const form = document.getElementById("form-cadastro");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nmUsuario = document.getElementById("nmUsuario").value;
  const emailUsuario = document.getElementById("emailUsuario").value;
  const senhaUsuario = document.getElementById("senhaUsuario").value;
  const nuTelefone = document.getElementById("nuTelefone").value;
  const nuCpf = document.getElementById("nuCpf").value;

  const { cpf, telefone } = limparCPFeTelefone(nuCpf, nuTelefone);

  if (nmUsuario && emailUsuario && senhaUsuario && telefone && cpf) {
    const payload = {
      nmUsuario: nmUsuario,
      emailUsuario: emailUsuario,
      senhaUsuario: senhaUsuario,
      nuTelefone: telefone,
      nuCpf: cpf,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao enviar dados: ${response.status}`);
        }
      })
      .then((data) => {
        alert("Dados enviados com sucesso!");
        console.log("Resposta da API: ", data);
      })
      .catch((error) => {
        alert(`Erro: ${error.message}`);
        console.error(`Erro: ${error.message}`);
      });
  } else {
    alert("Por favor, preencha todos os campos!");
  }
});
