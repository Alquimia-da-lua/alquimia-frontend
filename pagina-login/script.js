// funcao para ver a senha
const inputSenha = document.querySelector("#senha");
const button = document.querySelector("#verSenha");
button.addEventListener("click", verSenha);

function verSenha() {
  if (inputSenha.type == "password") {
    inputSenha.type = "text";
  } else {
    inputSenha.type = "password";
  }
}
