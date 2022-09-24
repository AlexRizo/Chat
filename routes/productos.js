import { Router } from 'express';
import { check } from 'express-validator';

import { validarJWT, validarCampos, isAdmin } from '../middlewares/index.js';
import { 
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto 
} from '../controllers/productos.js';
import { dbValidators } from '../helpers/index.js';

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerProductos );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( dbValidators.existeProductoId ),
    validarCampos,
], obtenerProducto );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( dbValidators.existeCategoriaId ),
    validarCampos
], crearProducto );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( dbValidators.existeProductoId ),
    validarCampos
], actualizarProducto );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    isAdmin,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( dbValidators.existeProductoId ),
    validarCampos,
], borrarProducto);



export {
    router as productosRouter
};