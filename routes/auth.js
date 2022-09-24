import Router from 'express';
import { check } from 'express-validator';

import { validarCampos, validarJWT } from '../middlewares/index.js';

import { login, googleSignIn, renovarToken } from '../controllers/auth.js';


const router = Router();

router.get('/', validarJWT, renovarToken);

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn );



export {
    router as authRouter
};