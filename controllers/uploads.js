import fs from 'fs';
import path from "path";
import { fileURLToPath, URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { response } from "express";
import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


import { subirArchivo } from "../helpers/index.js";
import { Producto, Usuario } from "../models/index.js";

const notImageFound = path.join( __dirname, '../assets/no-image.jpg');


const mostrarImagen = async(req, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            console.log(coleccion, id, modelo);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Error cuatrocientos cuatro'
            });
    }

    // TODO: eliminar archivo antiguo;
    if (modelo.img) {
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg)
        }
    }

    if ( modelo.img ) {
        return res.redirect(modelo.img)
    }

    res.sendFile(notImageFound);
}

const cargarArchivo = async(req, res = response || !req.files.archivo) => {
    try {
        // txt, md
        const nombre = await subirArchivo.subirArchivo(req.files, ['png', 'jpeg', 'jpg'], 'img');
        res.json({nombre});
    } catch (msg) {
        res.status(400).json({msg});
    }
}

const actualizarImagen = async(req, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            console.log(coleccion, id, modelo);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'watafak'
            });
    }

    // TODO: eliminar archivo antiguo;
    if (modelo.img) {
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg)
        }
    }

    const nombre = await subirArchivo.subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async(req, res = response) => {
    const {id, coleccion} = req.params;
    const {tempFilePath} = req.files.archivo;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            console.log(coleccion, id, modelo);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'watafak'
            });
    }

    // TODO: eliminar archivo antiguo;
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo)
}

export {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}