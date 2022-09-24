import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { isAdmin, rol } from "../middlewares/validar-roles.js";
import { validarArchivo } from "../middlewares/validar-archivo.js";

export {
    validarCampos,
    validarArchivo,
    validarJWT,
    isAdmin,
    rol
}