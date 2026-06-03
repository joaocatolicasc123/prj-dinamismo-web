const linkDasPessoas = "https://jsonplaceholder.typicode.com/users";
const linkDosPosts = "https://jsonplaceholder.typicode.com/posts";

let listaDePessoas = [];
let listaDePosts = [];

const formularioPessoa = document.getElementById("form-usuario");
const campoIdPessoa = document.getElementById("usuario-id");
const campoNomePessoa = document.getElementById("usuario-nome");
const botaoSalvarPessoa = document.getElementById("btn-usuario");
const containerParaMostrarPessoas = document.getElementById("lista-usuarios");

const formularioPost = document.getElementById("form-posts");
const campoIdPost = document.getElementById("posts-id");
const campoTituloPost = document.getElementById("post-titulo");
const campoTextoPost = document.getElementById("post-corpo");
const menuEscolhaDeAutor = document.getElementById("post-userId");
const botaoSalvarPost = document.getElementById("btn-post");
const containerParaMostrarPosts = document.getElementById("lista-posts");

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
    });

  fetch(linkDosPosts)
    .then((resposta) => resposta.json())
    .then((dadosBrutos) => {
      listaDePosts = dadosBrutos.reverse().map((post) => ({
        id: post.id,
        titulo: post.title,
        texto: post.body,
        donoDoPostId: post.userId,
      }));

      desenharPostsNaTela();
    });
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
    botaoSalvarPessoa.textContent = "Adicionar Usuário";
  } else {
    listaDePessoas.unshift({
      id: Date.now(),
      nome: nomePessoa,
    });
  }

  formularioPessoa.reset();
  campoIdPessoa.value = "";

  atualizarOpcoesDeAutores();
  desenharPessoasNaTela();
  desenharPostsNaTela();
});

function colocarPessoaNoFormulario(id) {
  const pessoaEncontrada = listaDePessoas.find((p) => p.id == id);
  if (!pessoaEncontrada) return;

  campoNomePessoa.value = pessoaEncontrada.nome;
  campoIdPessoa.value = pessoaEncontrada.id;
  botaoSalvarPessoa.textContent = "Atualizar Usuário";
}

function removerPessoa(id) {
  listaDePessoas = listaDePessoas.filter((p) => p.id != id);

  atualizarOpcoesDeAutores();
  desenharPessoasNaTela();
  desenharPostsNaTela();
}

function desenharPostsNaTela() {
  containerParaMostrarPosts.innerHTML = "";

  listaDePosts.forEach((post) => {
    const autorEncontrado = listaDePessoas.find(
      (p) => p.id == post.donoDoPostId,
    );
    const nomeDoAutor = autorEncontrado
      ? autorEncontrado.nome
      : "Autor desconhecido";

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
    botaoSalvarPost.textContent = "Adicionar Post";
  } else {
    listaDePosts.unshift({
      id: Date.now(),
      titulo: tituloPost,
      texto: textoPost,
      donoDoPostId: idAutorSelecionado,
    });
  }

  formularioPost.reset();
  campoIdPost.value = "";

  desenharPostsNaTela();
});

function colocarPostNoFormulario(id) {
  const postEncontrado = listaDePosts.find((p) => p.id == id);
  if (!postEncontrado) return;

  campoTituloPost.value = postEncontrado.titulo;
  campoTextoPost.value = postEncontrado.texto;
  campoIdPost.value = postEncontrado.id;
  menuEscolhaDeAutor.value = postEncontrado.donoDoPostId;

  botaoSalvarPost.textContent = "Atualizar Post";
}

function removerPost(id) {
  listaDePosts = listaDePosts.filter((p) => p.id != id);
  desenharPostsNaTela();
}

buscarDadosIniciais();
