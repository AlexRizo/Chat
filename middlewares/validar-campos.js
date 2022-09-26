import { validationResult } from "express-validator";


const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: 'Campos vacíos',
            errors
        });
    }

    next();
}

export{
    validarCampos,
}