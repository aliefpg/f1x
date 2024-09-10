const path = require('path');
const fs = require('fs').promises;
const { createWriteStream } = require('fs');

let articles = [
    { id: 'article-1', title: 'Article 1', author: 'Author 1', content: 'Content of article 1', image: null },
    { id: 'article-2', title: 'Article 2', author: 'Author 2', content: 'Content of article 2', image: null }
];

let users = [
    { username: 'admin', password: 'admin123', isAdmin: true }
];

const login = (currentUser) => async (request, h) => {
    const { username, password } = request.payload;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return h.response({ error: 'Invalid username or password' }).code(401);
    }

    currentUser.value = user;
    return h.response({ message: 'Login successful', user: currentUser.value }).code(200);
};

const getAllArticles = (request, h) => {
    return h.response(articles).code(200);
};

const getArticleById = (request, h) => {
    const { id } = request.params;
    const article = articles.find(a => a.id === id);
    if (!article) {
        return h.response({ error: 'Article not found' }).code(404);
    }
    return h.response(article).code(200);
};

const addArticle = (currentUser) => async (request, h) => {
    if (currentUser.value && currentUser.value.isAdmin) {
        const { title, author, content } = request.payload;
        let imageName = null;

        if (request.payload.image) {
            const file = request.payload.image;
            const allowedExtensions = ['.png', '.jpg', '.jpeg'];
            const fileExtension = path.extname(file.hapi.filename).toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                return h.response({ error: 'Invalid file type. Only PNG and JPEG files are allowed.' }).code(400);
            }

            imageName = `${Date.now()}-${file.hapi.filename}`;
            const uploadPath = path.join(__dirname, 'public', 'uploads', imageName);

            const fileStream = createWriteStream(uploadPath);
            file.pipe(fileStream);

            fileStream.on('finish', () => {
                console.log('File saved to:', uploadPath);
            });

            fileStream.on('error', (err) => {
                console.error('Error saving file:', err);
            });
        }

        const id = `article-${articles.length + 1}`;
        const newArticle = { id, title, author, content, image: imageName };
        articles.push(newArticle);
        return h.response(newArticle).code(201);
    } else {
        return h.response({ error: 'Unauthorized' }).code(403);
    }
};

const updateArticle = (currentUser) => async (request, h) => {
    if (currentUser.value && currentUser.value.isAdmin) {
        const { id } = request.params;
        const { title, author, content } = request.payload;
        const index = articles.findIndex(a => a.id === id);
        if (index === -1) {
            return h.response({ error: 'Article not found' }).code(404);
        }

        let imageName = articles[index].image;

        if (request.payload.image) {
            const file = request.payload.image;
            const allowedExtensions = ['.png', '.jpg', '.jpeg'];
            const fileExtension = path.extname(file.hapi.filename).toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                return h.response({ error: 'Invalid file type. Only PNG and JPEG files are allowed.' }).code(400);
            }

            imageName = `${Date.now()}-${file.hapi.filename}`;
            const uploadPath = path.join(__dirname, 'public', 'uploads', imageName);

            const fileStream = createWriteStream(uploadPath);
            file.pipe(fileStream);

            fileStream.on('finish', () => {
                console.log('File updated and saved to:', uploadPath);
            });

            fileStream.on('error', (err) => {
                console.error('Error saving file:', err);
            });

            if (articles[index].image) {
                const oldImagePath = path.join(__dirname, 'public', 'uploads', articles[index].image);
                await fs.unlink(oldImagePath).catch(() => {});
            }
        }

        const updatedArticle = { id, title, author, content, image: imageName };
        articles[index] = updatedArticle;
        return h.response(updatedArticle).code(200);
    } else {
        return h.response({ error: 'Unauthorized' }).code(403);
    }
};

const deleteArticle = (currentUser) => async (request, h) => {
    if (currentUser.value && currentUser.value.isAdmin) {
        const { id } = request.params;
        const index = articles.findIndex(a => a.id === id);
        if (index === -1) {
            return h.response({ error: 'Article not found' }).code(404);
        }

        if (articles[index].image) {
            const imagePath = path.join(__dirname, 'public', 'uploads', articles[index].image);
            await fs.unlink(imagePath).catch(() => {});
        }

        articles.splice(index, 1);
        return h.response({ message: 'Article deleted' }).code(200);
    } else {
        return h.response({ error: 'Unauthorized' }).code(403);
    }
};

module.exports = {
    login,
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle
};
