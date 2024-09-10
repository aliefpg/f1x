const handlers = require('./handlers');
const path = require('path');

module.exports = (currentUser) => [
    {
        method: 'POST',
        path: '/login',
        handler: handlers.login(currentUser)
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
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 5 * 1024 * 1024, // 5MB max file size
                multipart: true
            },
            handler: handlers.addArticle(currentUser)
        }
    },
    {
        method: 'PUT',
        path: '/articles/{id}',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 5 * 1024 * 1024, // 5MB max file size
                multipart: true
            },
            handler: handlers.updateArticle(currentUser)
        }
    },
    {
        method: 'DELETE',
        path: '/articles/{id}',
        handler: handlers.deleteArticle(currentUser)
    }
];
