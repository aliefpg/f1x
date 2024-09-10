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
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Simpan user di localStorage
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
    localStorage.removeItem('currentUser'); // Hapus user dari localStorage
    document.getElementById('add-article-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none';
    loadArticles();
}

// Tampilkan formulir artikel
function showArticleForm() {
    document.getElementById('article-form').style.display = 'block';
    document.getElementById('save-article-button').style.display = 'inline-block';
    document.getElementById('update-article-button').style.display = 'none';
}

// Sembunyikan formulir artikel
function hideArticleForm() {
    document.getElementById('article-form').style.display = 'none';
    document.getElementById('article-id').value = '';
    document.getElementById('article-title').value = '';
    document.getElementById('article-author').value = '';
    document.getElementById('article-content').value = '';
    document.getElementById('article-image').value = '';
}

// Simpan atau update artikel tergantung pada mode (baru atau edit)
async function saveOrUpdateArticle() {
    const id = document.getElementById('article-id').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/articles/${id}` : '/articles';

    const formData = new FormData();
    formData.append('title', document.getElementById('article-title').value);
    formData.append('author', document.getElementById('article-author').value);
    formData.append('content', document.getElementById('article-content').value);

    const imageFile = document.getElementById('article-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(url, {
            method: method,
            body: formData,
            headers: {
                'Authorization': `Bearer ${currentUser.token}` // Ensure you have the token from login
            }
        });

        if (response.ok) {
            hideArticleForm();
            loadArticles();
        } else {
            const result = await response.json();
            alert(result.error || 'An error occurred while saving the article.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the article.');
    }
}

// Hapus artikel
async function deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        try {
            const response = await fetch(`/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });

            if (response.ok) {
                loadArticles();
            } else {
                const result = await response.json();
                alert(result.error || 'An error occurred while deleting the article.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the article.');
        }
    }
}

// Muat artikel dari server
async function loadArticles() {
    try {
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
                ${article.image ? `<img src="/uploads/${article.image}" alt="${article.title}">` : ''}
                ${currentUser && currentUser.isAdmin ? `
                    <button onclick="editArticle('${article.id}')">Edit</button>
                    <button onclick="deleteArticle('${article.id}')">Delete</button>
                ` : ''}
            `;
            articleList.appendChild(articleItem);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading articles.');
    }
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
            document.getElementById('save-article-button').style.display = 'none';
            document.getElementById('update-article-button').style.display = 'inline-block';
            showArticleForm();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading the article for editing.');
        });
}

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        document.getElementById('add-article-button').style.display = currentUser.isAdmin ? 'block' : 'none';
        document.getElementById('logout-button').style.display = 'block';
    }
    loadArticles();
});
