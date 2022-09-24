import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT, validarCampos, isAdmin } from '../middlewares/index.js';
import {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria, 
    borrarCategoria
} from '../controllers/categorias.js';
import { dbValidators } from "../helpers/index.js";

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( dbValidators.existeCategoriaId ),
    validarCampos,
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( dbValidators.existeCategoriaId ),
    validarCampos
],actualizarCategoria );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    isAdmin,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( dbValidators.existeCategoriaId ),
    validarCampos,
],borrarCategoria);




export {
    router as categoriasRouter
};