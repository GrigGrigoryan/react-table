process.env['root'] = __dirname;
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 5000;
const server = http.createServer(app);

onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

onListening = () => {
    const addr = server.address();
    console.log('Server is listening on: ' + addr.port);
}

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);