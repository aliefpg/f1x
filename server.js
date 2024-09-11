const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert'); // Untuk melayani file statis
const routes = require('./routes'); // Jika Anda menggunakan rute terpisah

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: true // Menambahkan CORS untuk mengizinkan semua domain
        }
    });

    // Daftarkan plugin Inert
    await server.register(Inert);

    // Rute untuk melayani file statis
    server.route({
        method: 'GET',
        path: '/{param*}', // Menangkap semua permintaan
        handler: {
            directory: {
                path: 'public', // Direktori untuk file statis
                redirectToSlash: true,
                index: true,
            }
        }
    });

    server.route(routes); // Rute tambahan jika ada

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
