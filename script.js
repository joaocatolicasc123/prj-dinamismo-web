const linkDasPessoas = "https://jsonplaceholder.typicode.com/users";
const linkDosPosts = "https://jsonplaceholder.typicode.com/posts";

let listaDePessoas = [];
let listaDePosts = [];

// Elementos - Usuários
const formularioPessoa = document.getElementById("form-usuario");
const campoIdPessoa = document.getElementById("usuario-id");
const campoNomePessoa = document.getElementById("usuario-nome");
const botaoSalvarPessoa = document.getElementById("btn-usuario");
const botaoCancelarPessoa = document.getElementById("btn-cancelar-usuario");
const containerParaMostrarPessoas = document.getElementById("lista-usuarios");

// Elementos - Posts
const formularioPost = document.getElementById("form-posts");
const campoIdPost = document.getElementById("posts-id");
const campoTituloPost = document.getElementById("post-titulo");
const campoTextoPost = document.getElementById("post-corpo");
const menuEscolhaDeAutor = document.getElementById("post-userId");
const botaoSalvarPost = document.getElementById("btn-post");
const botaoCancelarPost = document.getElementById("btn-cancelar-post");
const containerParaMostrarPosts = document.getElementById("lista-posts");

// Função Utilitária de Feedback Visual (Heurística #1)
function mostrarNotificacao(mensagem, tipo = "sucesso") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensagem;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function buscarDadosIniciais() {
  fetch(linkDasPessoas)
    .then((resposta) => resposta.json())
    .then((dadosBrutos) => {
      listaDePessoas = dadosBrutos.reverse().map((pessoa) => ({
        id: pessoa.id,
        nome: pessoa.name,
      }));

      desenharPessoasNaTela();
      atualizarOpcoesDeAutores();
    })
    .catch(() => mostrarNotificacao("Erro ao carregar usuários da API.", "aviso"));

  fetch(linkDosPosts)
    .then((resposta) => resposta.json())
    .then((dadosBrutos) => {
      listaDePosts = dadosBrutos.slice(0, 12).reverse().map((post) => ({
        id: post.id,
        titulo: post.title,
        texto: post.body,
        donoDoPostId: post.userId,
      }));

      desenharPostsNaTela();
    })
    .catch(() => mostrarNotificacao("Erro ao carregar publicações da API.", "aviso"));
}

function atualizarOpcoesDeAutores() {
  menuEscolhaDeAutor.innerHTML = '<option value="">Selecione um autor</option>';

  listaDePessoas.forEach((pessoa) => {
    const novaOpcao = document.createElement("option");
    novaOpcao.value = pessoa.id;
    novaOpcao.textContent = pessoa.nome;
    menuEscolhaDeAutor.appendChild(novaOpcao);
  });
}

function desenharPessoasNaTela() {
  containerParaMostrarPessoas.innerHTML = "";

  // Tratamento de Estado Vazio (Heurística #1)
  if (listaDePessoas.length === 0) {
    containerParaMostrarPessoas.innerHTML = '<li class="msg-vazia">Nenhum usuário cadastrado até o momento.</li>';
    return;
  }

  listaDePessoas.forEach((pessoa) => {
    const itemDaLista = document.createElement("li");

    itemDaLista.innerHTML = `
            <span>${pessoa.nome}</span>
            <div>
                <button class="btn-editar" onclick="colocarPessoaNoFormulario(${pessoa.id})">Editar</button>
                <button class="btn-deletar" onclick="removerPessoa(${pessoa.id})">Excluir</button>
            </div>
        `;

    containerParaMostrarPessoas.appendChild(itemDaLista);
  });
}

formularioPessoa.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const idPessoa = campoIdPessoa.value;
  const nomePessoa = campoNomePessoa.value;

  if (idPessoa) {
    listaDePessoas = listaDePessoas.map((pessoa) => {
      if (pessoa.id == idPessoa) {
        return { ...pessoa, nome: nomePessoa };
      }
      return pessoa;
    });
    mostrarNotificacao("Usuário atualizado com sucesso!");
    resetarFormularioUsuario();
  } else {
    listaDePessoas.unshift({
      id: Date.now(),
      nome: nomePessoa,
    });
    mostrarNotificacao("Usuário cadastrado com sucesso!");
    formularioPessoa.reset();
  }

  atualizarOpcoesDeAutores();
  desenharPessoasNaTela();
  desenharPostsNaTela();
});

function colocarPessoaNoFormulario(id) {
  const pessoaEncontrada = listaDePessoas.find((p) => p.id == id);
  if (!pessoaEncontrada) return;

  campoNomePessoa.value = pessoaEncontrada.nome;
  campoIdPessoa.value = pessoaEncontrada.id;
  botaoSalvarPessoa.textContent = "Salvar Alterações";
  botaoCancelarPessoa.style.display = "block"; // Controle e liberdade (Heurística #3)
  campoNomePessoa.focus();
}

function resetarFormularioUsuario() {
  formularioPessoa.reset();
  campoIdPessoa.value = "";
  botaoSalvarPessoa.textContent = "Adicionar Usuário";
  botaoCancelarPessoa.style.display = "none";
}

botaoCancelarPessoa.addEventListener("click", resetarFormularioUsuario);

function removerPessoa(id) {
  // Prevenção de Erros (Heurística #5)
  const confirmarExclusao = confirm("Tem certeza que deseja excluir este usuário? As publicações dele ficarão marcadas sem autor.");
  if (!confirmarExclusao) return;

  listaDePessoas = listaDePessoas.filter((p) => p.id != id);
  mostrarNotificacao("Usuário excluído do sistema.", "aviso");

  atualizarOpcoesDeAutores();
  desenharPessoasNaTela();
  desenharPostsNaTela();
}

function desenharPostsNaTela() {
  containerParaMostrarPosts.innerHTML = "";

  // Tratamento de Estado Vazio (Heurística #1)
  if (listaDePosts.length === 0) {
    containerParaMostrarPosts.innerHTML = '<div class="msg-vazia">Nenhum post publicado até o momento.</div>';
    return;
  }

  listaDePosts.forEach((post) => {
    const autorEncontrado = listaDePessoas.find(
      (p) => p.id == post.donoDoPostId,
    );
    const nomeDoAutor = autorEncontrado
      ? autorEncontrado.nome
      : "Autor excluído/desconhecido";

    const itemDoPost = document.createElement("li");

    itemDoPost.innerHTML = `
            <div>
                <h3>${post.titulo}</h3>
                <p>${post.texto}</p>
                <small class="post-autor">por <strong>${nomeDoAutor}</strong></small>
            </div>
            <div class="acoes-post">
                <button class="btn-editar" onclick="colocarPostNoFormulario(${post.id})">Editar</button>
                <button class="btn-deletar" onclick="removerPost(${post.id})">Excluir</button>
            </div>
        `;

    containerParaMostrarPosts.appendChild(itemDoPost);
  });
}

formularioPost.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const idPost = campoIdPost.value;
  const tituloPost = campoTituloPost.value;
  const textoPost = campoTextoPost.value;
  const idAutorSelecionado = Number(menuEscolhaDeAutor.value);

  if (idPost) {
    listaDePosts = listaDePosts.map((post) => {
      if (post.id == idPost) {
        return {
          ...post,
          titulo: tituloPost,
          texto: textoPost,
          donoDoPostId: idAutorSelecionado,
        };
      }
      return post;
    });
    mostrarNotificacao("Post atualizado com sucesso!");
    resetarFormularioPost();
  } else {
    listaDePosts.unshift({
      id: Date.now(),
      titulo: tituloPost,
      texto: textoPost,
      donoDoPostId: idAutorSelecionado,
    });
    mostrarNotificacao("Post publicado com sucesso!");
    formularioPost.reset();
  }

  desenharPostsNaTela();
});

function colocarPostNoFormulario(id) {
  const postEncontrado = listaDePosts.find((p) => p.id == id);
  if (!postEncontrado) return;

  campoTituloPost.value = postEncontrado.titulo;
  campoTextoPost.value = postEncontrado.texto;
  campoIdPost.value = postEncontrado.id;
  menuEscolhaDeAutor.value = postEncontrado.donoDoPostId;

  botaoSalvarPost.textContent = "Salvar Alterações";
  botaoCancelarPost.style.display = "block"; // Controle e liberdade (Heurística #3)
  campoTituloPost.focus();
}

function resetarFormularioPost() {
  formularioPost.reset();
  campoIdPost.value = "";
  botaoSalvarPost.textContent = "Adicionar Post";
  botaoCancelarPost.style.display = "none";
}

botaoCancelarPost.addEventListener("click", resetarFormularioPost);

function removerPost(id) {
  // Prevenção de Erros (Heurística #5)
  const confirmarExclusao = confirm("Deseja realmente apagar em definitivo esta publicação?");
  if (!confirmarExclusao) return;

  listaDePosts = listaDePosts.filter((p) => p.id != id);
  mostrarNotificacao("Post removido.", "aviso");
  desenharPostsNaTela();
}

buscarDadosIniciais();