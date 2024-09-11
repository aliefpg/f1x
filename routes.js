const handlers = require('./handlers');

module.exports = [
    {
        method: 'POST',
        path: '/login',
        handler: handlers.login
    },
    {
        method: 'GET',
        path: '/articles',
        handler: handlers.getAllArticles
    },
    {
        method: 'GET',
        path: '/articles/{id}',
        handler: handlers.getArticleById
    },
    {
        method: 'POST',
        path: '/articles',
        handler: handlers.addArticle
    },
    {
        method: 'PUT',
        path: '/articles/{id}',
        handler: handlers.updateArticle
    },
    {
        method: 'DELETE',
        path: '/articles/{id}',
        handler: handlers.deleteArticle
    }
];
