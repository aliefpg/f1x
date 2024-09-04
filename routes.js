const handlers = require('./handlers');

module.exports = function(currentUser) {
    return [
        {
            method: 'POST',
            path: '/login',
            handler: handlers.login(currentUser),
        },
        {
            method: 'GET',
            path: '/articles',
            handler: handlers.getAllArticles,
        },
        {
            method: 'GET',
            path: '/articles/{id}',
            handler: handlers.getArticleById,
        },
        {
            method: 'POST',
            path: '/articles',
            handler: handlers.addArticle(currentUser),
        },
        {
            method: 'PUT',
            path: '/articles/{id}',
            handler: handlers.updateArticle(currentUser),
        },
        {
            method: 'DELETE',
            path: '/articles/{id}',
            handler: handlers.deleteArticle(currentUser),
        }
    ];
};