const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const path = require('path');
const inert = require('@hapi/inert');

// Variabel global untuk menyimpan status login
let currentUser = { value: null };

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(inert);

    // Melayani file statis dari folder 'public'
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, 'public'),
                redirectToSlash: true,
                index: true,
            }
        }
    });

    // Register routes untuk API
    server.route(routes(currentUser));

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();