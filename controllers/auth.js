import { response } from 'express';
import bcryptjs from 'bcryptjs';

import { Usuario } from '../models/index.js'
import { JWT, google } from '../helpers/index.js';

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await JWT.generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}


const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, correo, img} = await google.googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                rol: 'USER_ROLE',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario Bloqueado'
            })
        }

        // Generar JWT;
        const token = await JWT.generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        });   
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Imposible verificar token',
            error
        })
    }
}

const renovarToken = async(req, res) => {
    const {usuario} = req;

    // Generar JWT;
    const token = await JWT.generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}



export {
    login,
    googleSignIn,
    renovarToken
}
