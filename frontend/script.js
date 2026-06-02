const URL_USERS = "http://localhost:3000/api/users";
const URL_POSTS = "http://localhost:3000/api/posts";

let dadosUsuarios = []
let dadosPosts = [];

const form_usuario = document.getElementById("form-usuario");
const usuario_id = document.getElementById("usuario-id");
const usuario_nome = document.getElementById("usuario-nome");
const btn_usuario = document.getElementById("btn-usuario");
const lista_usuarios = document.getElementById("lista-usuarios");

const form_posts = document.getElementById("form-posts");
const posts_id = document.getElementById("posts-id");
const post_titulo = document.getElementById("post-titulo");
const post_corpo = document.getElementById("post-corpo");
const btn_post = document.getElementById("btn-post");
const lista_posts = document.getElementById("lista-posts");

function inicializarDados() {
    fetch(URL_USERS)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao buscar Usuários");
            return res.json();
        })
        .then(users => {
            dadosUsuarios = users;
            renderUsers();
        })
        .catch(erro => console.error("Erro na API de Usuários: ", erro));

    fetch(URL_POSTS)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao buscar os Posts");
            return res.json();
        })
        .then(posts => {
            dadosPosts = posts;
            renderPosts();
        })
        .catch(erro => console.error("Erro na API de Posts: ", erro));
}

function renderUsers() {
    lista_usuarios.innerHTML = "";
    dadosUsuarios.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${user.name}</strong></span>
            <div>
                <button class="btn-editar" onclick="editarUser(${user.id})">Editar</button>
                <button class="btn-deletar" onclick="removerUser(${user.id})">Excluir</button>
            </div>
        `;
        lista_usuarios.appendChild(li);
    });
}

form_usuario.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = usuario_id.value;
    const nome = usuario_nome.value;

    if (id) {
        dadosUsuarios = dadosUsuarios.map(u => u.id == id ? { ...u, name: nome } : u)
        btn_usuario.textContent = "Adicionar Usuário";
    } else {
        const novoUsuario = { id: Date.now(), name: nome };
        dadosUsuarios.push(novoUsuario);
    }

    form_usuario.reset();
    usuario_id.value = "";
    renderUsers();
});

function editarUser(id) {
    const usuario = dadosUsuarios.find(u => u.id === id);
    if (usuario) {
        usuario_nome.value = usuario.name;
        usuario_id.value = usuario.id;
        btn_usuario.textContent = "Atualizar Usuário";
    }
}

function removerUser(id) {
    dadosUsuarios = dadosUsuarios.filter(u => u.id !== id);
    renderUsers();
}

function renderPosts() {
    lista_posts.innerHTML = '';
    dadosPosts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            </div>
            <div class="acoes-post">
                <button class="btn-editar" onclick="editarPost(${post.id})">Editar</button>
                <button class="btn-deletar" onclick="removerPost(${post.id})">Excluir</button>
            </div>
        `;
        lista_posts.appendChild(li);
    });
}

// Salvar (Adicionar ou Editar) Post
form_posts.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = posts_id.value;
    const titulo = post_titulo.value;
    const corpo = post_corpo.value;

    if (id) {
        // Modo Edição Local
        dadosPosts = dadosPosts.map(p => p.id == id ? { ...p, title: titulo, body: corpo } : p);
        btn_post.textContent = "Adicionar Post";
    } else {
        // Modo Criação Local
        const novoPost = { id: Date.now(), title: titulo, body: corpo };
        dadosPosts.push(novoPost);
    }

    form_posts.reset();
    posts_id.value = '';
    renderPosts();
});

function editarPost(id) {
    const post = dadosPosts.find(p => p.id === id);
    if (post) {
        post_titulo.value = post.title;
        post_corpo.value = post.body;
        posts_id.value = post.id;
        btn_post.textContent = "Atualizar Post";
    }
}

function removerPost(id) {
    dadosPosts = dadosPosts.filter(p => p.id !== id);
    renderPosts();
}

// Executa o Fetch ao carregar a página
inicializarDados();