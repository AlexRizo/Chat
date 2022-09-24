import mongoose from "mongoose";

const CategoriaSchema = mongoose.Schema({
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
    }
});


CategoriaSchema.methods.toJSON = function() {
    const {__v, _id:uid, ...categoria} = this.toObject();
    
    return Object.assign({ uid }, categoria);
}


export default mongoose.model('Categoria', CategoriaSchema);
