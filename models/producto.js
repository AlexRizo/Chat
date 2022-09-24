import mongoose from 'mongoose';

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible: { type: Boolean, defult: true },
    img: { type: String },
});


ProductoSchema.methods.toJSON = function() {
    const {__v, _id:uid, estado, ...producto} = this.toObject();

    return Object.assign({uid}, producto);
}

export default mongoose.model('Producto', ProductoSchema);