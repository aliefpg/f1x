// Mengambil elemen-elemen dari HTML
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const closeBtn = document.getElementById('close-btn');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const addArticleBtn = document.getElementById('add-article-btn');
const crudButtons = document.getElementById('crud-buttons');
const articlesSection = document.getElementById('articles');

// Modal untuk edit artikel
const editModal = document.getElementById('edit-modal');
const titleInput = document.getElementById('title-input');
const authorInput = document.getElementById('author-input');
const contentInput = document.getElementById('content-input');
const saveEditBtn = document.getElementById('save-edit-btn');

// Modal untuk menambah artikel
const addModal = document.getElementById('add-modal');
const addTitleInput = document.getElementById('add-title-input');
const addAuthorInput = document.getElementById('add-author-input');
const addContentInput = document.getElementById('add-content-input');
const saveAddBtn = document.getElementById('save-add-btn');

let currentEditId = null;

// Fungsi untuk menampilkan modal login
function showLoginModal() {
    loginModal.classList.remove('hidden');
}

// Fungsi untuk menyembunyikan modal login
function hideLoginModal() {
    loginModal.classList.add('hidden');
    loginError.classList.add('hidden'); // Reset error message
}

// Fungsi untuk login
async function login(event) {
    event.preventDefault(); // Mencegah form dari pengiriman default

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const result = await response.json();
        alert('Login successful');

        // Hide login modal and show CRUD buttons
        hideLoginModal();
        crudButtons.classList.remove('hidden');
        logoutBtn.classList.remove('hidden'); // Tampilkan tombol logout
        loginBtn.classList.add('hidden'); // Sembunyikan tombol login

        fetchArticles(); // Fetch articles after successful login
    } catch (error) {
        console.error('Error logging in:', error);
        loginError.classList.remove('hidden'); // Show error message
    }
}

// Fungsi untuk mengambil semua artikel
async function fetchArticles() {
    try {
        const response = await fetch('/articles');
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        alert('Failed to fetch articles. Please try again later.');
    }
}

// Fungsi untuk menampilkan artikel di antarmuka
function displayArticles(articles) {
    articlesSection.innerHTML = ''; // Kosongkan daftar sebelum menambahkan yang baru

    articles.forEach(article => {
        const articleItem = createArticleItem(article);
        articlesSection.appendChild(articleItem);
    });
}

// Fungsi untuk membuat elemen artikel dalam daftar
function createArticleItem(article) {
    const articleItem = document.createElement('div');
    articleItem.classList.add('article-item');

    const title = document.createElement('h3');
    title.textContent = article.title;

    const author = document.createElement('p');
    author.textContent = `Author: ${article.author}`;

    const content = document.createElement('p');
    content.textContent = article.content;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showEditForm(article));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteArticle(article.id));

    articleItem.appendChild(title);
    articleItem.appendChild(author);
    articleItem.appendChild(content);
    articleItem.appendChild(editButton);
    articleItem.appendChild(deleteButton);

    return articleItem;
}

// Fungsi untuk menghapus artikel
async function deleteArticle(id) {
    try {
        const response = await fetch(`/articles/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete article');
        }

        alert('Article deleted successfully');
        fetchArticles();
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article. Please try again later.');
    }
}

// Fungsi untuk menampilkan modal edit dengan data artikel
function showEditForm(article) {
    currentEditId = article.id;
    titleInput.value = article.title;
    authorInput.value = article.author;
    contentInput.value = article.content;

    editModal.classList.remove('hidden');
}

// Menyembunyikan modal edit
function hideEditForm() {
    editModal.classList.add('hidden');
}

// Menyimpan perubahan ketika tombol Save ditekan
saveEditBtn.addEventListener('click', async () => {
    const title = titleInput.value;
    const author = authorInput.value;
    const content = contentInput.value;

    await updateArticle(currentEditId, { title, author, content });
    hideEditForm();
});

// Fungsi untuk memperbarui artikel
async function updateArticle(id, updatedData) {
    try {
        const response = await fetch(`/articles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update article');
        }

        alert('Article updated successfully');
        fetchArticles(); // Memuat ulang artikel setelah berhasil diupdate
    } catch (error) {
        console.error('Error updating article:', error);
        alert('Failed to update article. Please try again later.');
    }
}

// Fungsi untuk menampilkan modal tambah artikel
function showAddForm() {
    addModal.classList.remove('hidden');
}

// Menyembunyikan modal tambah artikel
function hideAddForm() {
    addModal.classList.add('hidden');
}

// Menyimpan artikel baru ketika tombol Save ditekan
saveAddBtn.addEventListener('click', async () => {
    const title = addTitleInput.value;
    const author = addAuthorInput.value;
    const content = addContentInput.value;

    await addArticle({ title, author, content });
    hideAddForm();
});

// Fungsi untuk menambahkan artikel
async function addArticle(articleData) {
    try {
        const response = await fetch('/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articleData)
        });

        if (!response.ok) {
            throw new Error('Failed to add article');
        }

        alert('Article added successfully');
        fetchArticles(); // Memuat ulang artikel setelah berhasil ditambahkan
    } catch (error) {
        console.error('Error adding article:', error);
        alert('Failed to add article. Please try again later.');
    }
}

// Fungsi untuk logout
function logout() {
    // Reset status login dan antarmuka pengguna
    crudButtons.classList.add('hidden'); // Sembunyikan tombol CRUD
    logoutBtn.classList.add('hidden'); // Sembunyikan tombol logout
    loginBtn.classList.remove('hidden'); // Tampilkan tombol login
    articlesSection.innerHTML = ''; // Kosongkan daftar artikel
    alert('Logout successful');
}

// Event listeners
loginBtn.addEventListener('click', showLoginModal);
closeBtn.addEventListener('click', hideLoginModal);
loginForm.addEventListener('submit', login);
addArticleBtn.addEventListener('click', showAddForm); // Tombol untuk menambah artikel
// Menutup modal tambah artikel saat mengklik tombol close
const closeAddBtn = document.getElementById('close-add-btn');
closeAddBtn.addEventListener('click', hideAddForm);

// Event listener untuk tombol logout
logoutBtn.addEventListener('click', logout); // Tambahkan event listener untuk logout

// Memanggil fungsi fetchArticles untuk pertama kali saat aplikasi dimuat
fetchArticles();
