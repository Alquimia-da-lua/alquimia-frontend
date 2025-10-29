// funcao para ver a senha
const inputSenha = document.querySelector("#senhaUsuario");
const button = document.querySelector("#verSenha");
button.addEventListener("click", verSenha);

function verSenha() {
  if (inputSenha.type == "password") {
    inputSenha.type = "text";
  } else {
    inputSenha.type = "password";
  }
}

function toastSucesso() {
  var toastEl = document.getElementById("toastSucesso");
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function toastErro() {
  var toastEl = document.getElementById("toastErro");
  var toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// envio do formulario
const apiUrl = "http://localhost:8084/api/usuario/login";
const form = document.getElementById("form-login");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const emailUsuario = document.getElementById("emailUsuario").value.trim();
  const senhaUsuarioVal = document.getElementById("senhaUsuario").value;

  if (emailUsuario && senhaUsuarioVal) {
    const payload = {
      emailUsuario: emailUsuario,
      senhaUsuario: senhaUsuarioVal,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          toastErro();
        }
      })
      .then((data) => {
        // salva dados do usuário no localStorage
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            nome: data.nmUsuario,
            email: data.emailUsuario,
            telefone: data.nuTelefone,
            roleUsuario: data.roleUsuario,
          })
        );
        toastSucesso();
        window.location.href = "../pagina-principal/index.html";
      })

      .catch((error) => {
        console.error(`Erro: ${error.message}`);
        toastErro();
      });
  }
});
