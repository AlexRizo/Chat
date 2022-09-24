const url = (window.location.hostname.includes('localhost') 
            ? 'http://localhost:8080/api/auth/'  
            : 'https://chat-perro.herokuapp.com/api/auth/');


let usuario = null;
let socket  = null;

// TODO: Referencias HTML;
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('El token no es válido');
    }

    const resp = await fetch(url, {
        headers: {'x-auth-token': token}
    });

    const {usuario:userDB, token:tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre

    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-auth-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket Online');
    })
    
    socket.on('disconnect', () => {
        console.log('Socket Offline');
    })

    socket.on('recibir-mensajes', mensajes);

    socket.on('mensaje-privado', ({de, mensaje}) => {
        alert(`[ ${de} ] dice: ${mensaje}`);
    });

    socket.on('usuarios-conectados', usuariosConectados);
}


const usuariosConectados = (usuarios = []) => {
    let usersHTML = '';
    usuarios.forEach(({nombre, uid}) => {
        usersHTML += `
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `
    });
    ulUsuarios.innerHTML = usersHTML;
}

const mensajes = (mensajes = []) => {
    let mensajesHTML = '';
    mensajes.reverse().forEach(({nombre, mensaje}) => {
        mensajesHTML += `
        <li>
            <p>
                <span class="text-primary">${nombre}</span>
                <span>${mensaje}</span>
            </p>
        </li>
        `
    });
    ulMensajes.innerHTML = mensajesHTML;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) return;
    if (mensaje.length === 0) return;
    
    socket.emit('enviar-mensaje', {mensaje, uid});
    txtMensaje.value = '';
});

btnSalir.onclick = () => {
    localStorage.removeItem('token');
    location.reload();
}

const main = async() => {
    // Validar JWT;
    await validarJWT();
}

main();