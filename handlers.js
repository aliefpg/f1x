const pool = require('./db');

const login = async (request, h) => {
    const { username, password } = request.payload;

    // Tambahkan log untuk melihat nilai username dan password
    console.log(`Username: ${username}, Password: ${password}`);

    // Query database menggunakan tabel admin
    const [rows] = await pool.execute('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password]);

    if (rows.length === 0) {
        return h.response({ error: 'Invalid username or password' }).code(401);
    }

    // Kirim respons jika login berhasil
    return h.response({ message: 'Login successful', user: rows[0] }).code(200);
};


const getAllArticles = async (request, h) => {
    const [rows] = await pool.execute('SELECT * FROM articles');
    return h.response(rows).code(200);
};

const getArticleById = async (request, h) => {
    const { id } = request.params;
    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]);

    if (rows.length === 0) {
        return h.response({ error: 'Article not found' }).code(404);
    }

    return h.response(rows[0]).code(200);
};

const addArticle = async (request, h) => {
    const { title, author, content } = request.payload;

    const [result] = await pool.execute('INSERT INTO articles (title, author, content) VALUES (?, ?, ?)', [title, author, content]);
    const id = result.insertId;

    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]);
    return h.response(rows[0]).code(201);
};

const updateArticle = async (request, h) => {
    const { id } = request.params;
    const { title, author, content } = request.payload;

    const [result] = await pool.execute('UPDATE articles SET title = ?, author = ?, content = ? WHERE id = ?', [title, author, content, id]);

    if (result.affectedRows === 0) {
        return h.response({ error: 'Article not found' }).code(404);
    }

    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]);
    return h.response(rows[0]).code(200);
};


const deleteArticle = async (request, h) => {
    const { id } = request.params;

    const [result] = await pool.execute('DELETE FROM articles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        return h.response({ error: 'Article not found' }).code(404);
    }

    return h.response({ message: 'Article deleted successfully' }).code(200);
};

// Pastikan untuk mengekspor deleteArticle
module.exports = {
    login,
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle // Tambahkan ini
};
