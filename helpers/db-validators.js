import {Usuario, Categoria, Producto} from "../models/index.js";
import Role from "../models/role.js";

const rolValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioId = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeUsuario = await Usuario.findById( id ).exec();
        if ( !existeUsuario ) {
            throw new Error(`El id ${ id } no existe`);
        } else if(!existeUsuario.estado){
            throw new Error(`No existe un usuario con el id ${id}`)
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

/**
 * Categorias
 */
const existeCategoriaId = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeCategoria = await Categoria.findById( id ).exec();
        if ( !existeCategoria || !existeCategoria.estado) {
            throw new Error(`No existe una categoría con el id ${id}`);
        } else if(!existeCategoria.estado){
            throw new Error(`No existe una categoría con el id ${id}`)
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

/**
 * Productos
 */
const existeProductoId = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeProducto = await Producto.findById( id ).exec();
        if ( !existeProducto || !existeProducto.estado) {
            throw new Error(`No existe un producto con el id ${id}`);
        } else if(!existeProducto.estado){
            throw new Error(`No existe un producto con el id ${id}`)
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}

export{
    rolValido,
    emailExiste,
    existeUsuarioId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas
}

