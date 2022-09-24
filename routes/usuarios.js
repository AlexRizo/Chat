import { Router } from 'express';
import { check } from 'express-validator';

import { 
    validarCampos,
    validarJWT,
    // esAdminRole,
    rol 
} from '../middlewares/index.js';

import { 
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} from '../controllers/usuarios.js';
import { dbValidators } from '../helpers/index.js';

const router = Router();


router.get('/', usuariosGet );

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( dbValidators.existeUsuarioId ),
    check('rol').custom( dbValidators.rolValido ), 
    validarCampos
],usuariosPut );

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( dbValidators.emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( dbValidators.rolValido ), 
    validarCampos
], usuariosPost );

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    rol('ADMIN_ROLE', 'VENTAS_ROLE',),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( dbValidators.existeUsuarioId ),
    validarCampos
],usuariosDelete );

router.patch('/', usuariosPatch );


export {
    router as usuariosRouter
};