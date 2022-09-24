import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server as socketServer } from 'socket.io';

import path from "path";
import { fileURLToPath, URL } from 'url';

import { dbConnection } from '../database/config.js';
import {
    authRouter, 
    buscarRouter, 
    categoriasRouter, 
    productosRouter, 
    uploadsRouter, 
    usuariosRouter
} from '../routes/index.js'
import socketController from '../sockets/controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
        this.io = new socketServer(this.server);

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets;
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.buscar, buscarRouter);
        this.app.use( this.paths.auth, authRouter);
        this.app.use( this.paths.categorias, categoriasRouter);
        this.app.use( this.paths.productos, productosRouter);
        this.app.use( this.paths.usuarios, usuariosRouter);
        this.app.use( this.paths.uploads, uploadsRouter);
        
        // this.app.get('*', (req, res) => {
        //     res.sendFile(path.join(__dirname, '../public', '404.html'));
        // });
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Running on port:', this.port );
        });
    }

}




export default Server;
