import { Socket } from 'socket.io';
import { JWT } from '../helpers/index.js';
import { Chat } from '../models/index.js'

const chat = new Chat();

const socketController = async(socket = new Socket(), io) => { 
    const usuario = await JWT.comporbarJWT(socket.handshake.headers['x-auth-token']);
    if (!usuario) {
        return socket.disconnect();
    }

    // Agregar el usuario conectado
    chat.conectarUsuario(usuario);
    io.emit('usuarios-conectados', chat.usuariosArr)
    socket.emit('recibir-mensajes', chat.ultimos10)

    // Conectarlo a una sala privada
    socket.join(usuario.id); // global, socket.id, usuario.id

    // Quitar el usuario desconectado
    socket.on('disconnect', () => {
        chat.desconectarUsuario(usuario.id)
        io.emit('usuarios-conectados', chat.usuariosArr)
    });

    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if (uid) {
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje})
        } else { 
            chat.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chat.ultimos10)
        }
        
    })
}

export default socketController;