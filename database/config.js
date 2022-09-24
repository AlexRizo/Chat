import mongoose from 'mongoose';


const dbConnection = async() => {
    try {
        mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true, // <-- no longer necessary
            useUnifiedTopology: true // <-- no longer necessary
        });
        
        mongoose.set('returnOriginal', false)

        console.log('DB status: ok');
    } catch (error) {
        throw new Error('Error al conectar con la base de datos; ' + error);
    }
}

export {
    dbConnection,
}