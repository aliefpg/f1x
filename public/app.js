let currentUser = null;

// Tampilkan formulir login
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('show-login-button').style.display = 'none';
}

// Sembunyikan formulir login
function hideLoginForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('show-login-button').style.display = 'block';
}

// Login ke sistem
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        currentUser = result.user;
        hideLoginForm();
        document.getElementById('add-article-button').style.display = currentUser.isAdmin ? 'block' : 'none';
        document.getElementById('logout-button').style.display = 'block';
        loadArticles();
    } else {
        alert(result.error);
    }
}

// Logout dari sistem
function logout() {
    currentUser = null;
    document.getElementById('add-article-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none';
    // document.getElementById('article-list').innerHTML = '';
    loadArticles();
}

// Tampilkan formulir artikel
function showArticleForm() {
    document.getElementById('article-form').style.display = 'block';
}

// Sembunyikan formulir artikel
function hideArticleForm() {
    document.getElementById('article-form').style.display = 'none';
    document.getElementById('article-id').value = '';
    document.getElementById('article-title').value = '';
    document.getElementById('article-author').value = '';
    document.getElementById('article-content').value = '';
}

// Simpan atau update artikel tergantung pada mode (baru atau edit)
async function saveOrUpdateArticle() {
    const id = document.getElementById('article-id').value;
    const method = id ? 'PUT' : 'POST'; // Menggunakan PUT untuk update, POST untuk create
    const url = id ? `/articles/${id}` : '/articles'; // URL untuk update atau create

    const title = document.getElementById('article-title').value;
    const author = document.getElementById('article-author').value;
    const content = document.getElementById('article-content').value;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}` // Jika menggunakan token
        },
        body: JSON.stringify({ title, author, content })
    });

    const result = await response.json();
    if (response.ok) {
        hideArticleForm();
        loadArticles();
    } else {
        alert(result.error);
    }
}

// Hapus artikel
async function deleteArticle(id) {
    const response = await fetch(`/articles/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${currentUser.token}` // Jika menggunakan token
        }
    });

    const result = await response.json();
    if (response.ok) {
        loadArticles();
    } else {
        alert(result.error);
    }
}

// Muat artikel dari server
async function loadArticles() {
    const response = await fetch('/articles');
    const articles = await response.json();

    const articleList = document.getElementById('article-list');
    articleList.innerHTML = '';

    articles.forEach(article => {
        const articleItem = document.createElement('div');
        articleItem.className = 'article-item';
        articleItem.innerHTML = `
            <h3>${article.title}</h3>
            <p><strong>Author:</strong> ${article.author}</p>
            <p>${article.content}</p>
            ${currentUser && currentUser.isAdmin ? `
                <button onclick="editArticle('${article.id}')">Edit</button>
                <button onclick="deleteArticle('${article.id}')">Delete</button>
            ` : ''}
        `;
        articleList.appendChild(articleItem);
    });
}

// Edit artikel
function editArticle(id) {
    fetch(`/articles/${id}`)
        .then(response => response.json())
        .then(article => {
            document.getElementById('article-id').value = article.id;
            document.getElementById('article-title').value = article.title;
            document.getElementById('article-author').value = article.author;
            document.getElementById('article-content').value = article.content;
            showArticleForm();
        });
}

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
});