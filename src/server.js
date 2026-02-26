import { connectDB, disconnectDB } from './config/configdbd.js'
import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT

// Rutas API
app.use('/api/auth', authRoutes)

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Servidor corriendo en puerto', PORT)
        })
    })
    .catch(() => {
        disconnectDB()
    })
