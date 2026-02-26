import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const dbURL = process.env.MONGO_DB_URL.replace(
            '<db_username>',
            process.env.MONGO_DB_USER
        )
            .replace('<db_password>', process.env.MONGO_DB_PASSWORD)
            .replace('<db_name>', process.env.MONGO_DB_NAME)

        await mongoose.connect(dbURL)
        console.log('Conectado a MongoDB')
    } catch (error) {
        console.error(
            'Ocurrio un error al intentar conectarse con la base de datos',
            error
        )
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log('Base de datos MongoDB desconectada')
    } catch (error) {
        console.error('Error al desconectar desde MongoDB', error)
    }
}
