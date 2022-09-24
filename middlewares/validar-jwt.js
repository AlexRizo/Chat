import { request, response } from "express"
import jwt from "jsonwebtoken"

import { Usuario } from '../models/index.js';


const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-auth-token');
        
    if (!token) {
        return res.status(401).json({
            msg: 'Acceso Denegado'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no encontrado'
            })
        }

        // Verificar estado de usuario;
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario eliminado'
            })
        }
        
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token inválido'
        })
    }
}

export{
    validarJWT,
}