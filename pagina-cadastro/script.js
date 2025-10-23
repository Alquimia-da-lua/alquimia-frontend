// funcao para ver a senha
const inputSenha = document.querySelector("#senha");
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
    let inputValue = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    inputValue = inputValue.substring(0, 11); // Limita a 11 caracteres (9 dígitos + 2 pontos)

    if (inputValue.length > 10) {
      inputValue = inputValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (inputValue.length > 6) {
      inputValue = inputValue.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (inputValue.length > 2) {
      inputValue = inputValue.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }

    event.target.value = inputValue;
  });
