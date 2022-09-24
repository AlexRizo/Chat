import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos, validarArchivo } from '../middlewares/index.js';
import { 
    cargarArchivo,
    // actualizarImagen,
    mostrarImagen, 
    actualizarImagenCloudinary
} from '../controllers/uploads.js';
import { dbValidators } from '../helpers/index.js';

const router = Router();


router.post( '/', validarArchivo, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => dbValidators.coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], actualizarImagenCloudinary )
// ], actualizarImagen )

router.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => dbValidators.coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagen  )




export {
    router as uploadsRouter
};