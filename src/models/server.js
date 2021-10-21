const express = require('express');
const cors = require('cors');
var path = require('path');

const routes = require('../routes/indexRoutes');

const { socketController } = require('../sockets/whatsappSocket');

// const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT || '8001';

        // Sockets
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        // this.paths = {
        //     auth:       '/api/auth',
        //     buscar:     '/api/buscar',
        //     categorias: '/api/categorias',
        //     productos:  '/api/productos',
        //     usuarios:   '/api/usuarios',
        // }


        // Conectar a base de datos
        // this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        routes( this.app );

        //Sockets
        this.sockets();
    }

    // async conectarDB() {
    //     await dbConnection();
    // }

    sockets() {
        this.io.on('connection', socketController);
        // this.io.on('connection', socket => {
        //     console.log('Cliente conectado : ', socket.id);
        //     // socket.on('event', data => { /* … */ });
        //     socket.on('disconnect', () => { console.log('Cliente desconectado :', socket.id); });
        //   });
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        // this.app.use( express.static('public') );
        console.log(path.join(__dirname, '../public'));
        // this.app.use(express.static(__dirname + '../public'));
        this.app.use(express.static(path.join(__dirname, '../public')));


    }

    // routes() {
        
    //     this.app.use( this.paths.auth, require('../routes/auth'));
    //     this.app.use( this.paths.buscar, require('../routes/buscar'));
    //     this.app.use( this.paths.categorias, require('../routes/categorias'));
    //     this.app.use( this.paths.productos, require('../routes/productos'));
    //     this.app.use( this.paths.usuarios, require('../routes/usuarios'));
    // }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
