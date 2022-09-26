import Router from 'express';
import { check } from 'express-validator';

import { validarCampos, validarJWT } from '../middlewares/index.js';

import { login, googleSignIn, renovarToken, register } from '../controllers/auth.js';
import { dbValidators } from '../helpers/index.js';


const router = Router();

router.get('/', validarJWT, renovarToken);

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/register',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( dbValidators.emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( dbValidators.rolValido ), 
    validarCampos
],register );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn );



export {
    router as authRouter
};