const cadastroForm = document.getElementById("cadastroForm");
const loginForm = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");
const dashboard = document.getElementById("dashboard");
const perfilDiv = document.getElementById("perfil");
const sairBtn = document.getElementById("sairBtn");
const temaBtn = document.getElementById("temaBtn");
const tarefaForm = document.getElementById("tarefaForm");
const listaTarefas = document.getElementById("listaTarefas");
const estatisticas = document.getElementById("estatisticas");

// Cadastro
cadastroForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("cadastroNome").value;
  const email = document.getElementById("cadastroEmail").value;
  const senha = document.getElementById("cadastroSenha").value;
  const foto = document.getElementById("cadastroFoto").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const existeUsuario = usuarios.find((user) => user.email === email);
  if (existeUsuario) {
    mensagem.textContent = "Este email já está cadastrado!";
    mensagem.style.color = "red";
    return;
  }

  usuarios.push({ nome, email, senha, foto });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mensagem.textContent = "Cadastro realizado com sucesso!";
  mensagem.style.color = "green";
});

// Login
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioValido = usuarios.find(
    (user) => user.email === email && user.senha === senha
  );

  if (usuarioValido) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioValido));
    mostrarDashboard(usuarioValido);
  } else {
    mensagem.textContent = "Email ou senha incorretos!";
    mensagem.style.color = "red";
  }
});

// Mostrar Dashboard
function mostrarDashboard(usuario) {
  document.getElementById("cadastro").style.display = "none";
  document.getElementById("login").style.display = "none";
  mensagem.style.display = "none";
  dashboard.style.display = "block";

  perfilDiv.innerHTML = `
    <h2>${usuario.nome}</h2>
    <img src="${usuario.foto}" alt="Foto de perfil" width="100">
    <p>Email: ${usuario.email}</p>
  `;

  carregarTarefas(usuario);
  atualizarEstatisticas(usuario);
}

// Logout
sairBtn.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  location.reload();
});

// Dark Mode
temaBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
});

// Carregar tema salvo
if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark");
}

// Tarefas
function carregarTarefas(usuario) {
  let tarefas = JSON.parse(localStorage.getItem(`tarefas_${usuario.email}`)) || [];
  mostrarTarefas(tarefas, usuario);

  tarefaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const novaTarefa = document.getElementById("novaTarefa").value;
    tarefas.push({ texto: novaTarefa, concluida: false });
    localStorage.setItem(`tarefas_${usuario.email}`, JSON.stringify(tarefas));
    mostrarTarefas(tarefas, usuario);
    tarefaForm.reset();
  });
}

function mostrarTarefas(tarefas, usuario) {
  listaTarefas.innerHTML = "";
  tarefas.forEach((tarefa, index) => {
    const item = document.createElement("li");
    item.textContent = tarefa.texto;
    if (tarefa.concluida) item.style.textDecoration = "line-through";
    item.addEventListener("click", () => {
      tarefas[index].concluida = !tarefas[index].concluida;
      localStorage.setItem(`tarefas_${usuario.email}`, JSON.stringify(tarefas));
      mostrarTarefas(tarefas, usuario);
    });
    listaTarefas.appendChild(item);
  });
}

// Estatísticas
function atualizarEstatisticas(usuario) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const tarefas = JSON.parse(localStorage.getItem(`tarefas_${usuario.email}`)) || [];
  estatisticas.textContent = `Usuários cadastrados: ${usuarios.length} | Suas tarefas: ${tarefas.length}`;
}

// Verificar sessão ativa
window.addEventListener("load", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuarioLogado) {
    mostrarDashboard(usuarioLogado);
  }
});
