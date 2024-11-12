// Função para cadastrar usuário
async function cadastrarUsuario(event) {
  event.preventDefault();

  const user = document.getElementById("user").value;
  const email = document.getElementById("email").value;
  const passWord = document.getElementById("passWord").value;

  const userData = { user, email, passWord, isMaster: false }; // Define isMaster como falso por padrão

  try {
    const response = await fetch("http://localhost:8080", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (response.status === 201) {
      alert("Usuário cadastrado com sucesso!");
      document.getElementById("userForm").reset();
    } else {
      alert("Erro ao cadastrar o usuário");
      console.error(result);
    }
  } catch (error) {
    alert("Erro de comunicação com o servidor.");
    console.error(error);
  }
}

// Função para fazer login
async function autenticarLogin(event) {
  event.preventDefault(); // Previne o envio padrão do formulário

  const email = document.getElementById("loginEmail").value;
  const passWord = document.getElementById("loginPassWord").value;

  const loginData = { email, passWord };

  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    if (response.status === 200) {
      alert(result.message); // Exibe mensagem de sucesso

      // Verifica se o e-mail corresponde ao "gabriel@01.com"
      // No caso de login bem-sucedido:
      if (email === "gabriel@01.com") {
        // Redireciona para a página master-dashboard.html
        window.location.href = "/master-dashboard.html";
      } else {
        // Redireciona para a página do usuário comum
        window.location.href = "/user-dashboard.html";
      }
    } else {
      alert(result.message); // Exibe erro se houver
    }
  } catch (error) {
    alert("Erro de comunicação com o servidor.");
    console.error(error);
  }
}

document
  .getElementById("loginForm")
  .addEventListener("submit", autenticarLogin);

// Adiciona listeners aos formulários
document
  .getElementById("userForm")
  .addEventListener("submit", cadastrarUsuario);

// public/login.js
const form = document.querySelector("#loginform");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const passWord = document.querySelector("#password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, passWord }),
  });

  const data = await response.json();

  if (response.status === 200) {
    window.location.href = data.redirectTo; // Redireciona para a página de destino
  } else {
    alert(data.message); // Exibe uma mensagem de erro, se houver
  }
});