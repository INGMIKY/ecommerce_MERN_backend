import { registerSchema } from '../schemas/authShema.js'
import UserModel from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        console.log(req.body)
        // Traer la clave secreta de JWT
        const JWT_SECRET = process.env.JWT_SECRET

        // Extraer los datos del usuario
        const { username, email, password } = registerSchema.parse(req.body)

        // omprobar si ya existe el usuario
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: 'el usuario ya existe' })
        }

        // Encriptar la contrasenia
        const hashedPasword = await bcrypt.hash(password, 10)

        // Comprobar el usuario admin
        const isFirstUser = (await UserModel.countDocuments()) === 0

        // Crear el usuario y guardar en la DB
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPasword,
            isAdmin: isFirstUser,
        })

        // Generar un token con JWT
        // payload
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: '1h',
        })

        console.log('TOKEN: ', token)
        // header.payload.signature
        // asdsadsadsad

        // Enviar el token como una cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //true
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
        })
        console.log(newUser)
        res.json({ newUser: newUser })
    } catch (error) {
        res.json(error)
    }
}
