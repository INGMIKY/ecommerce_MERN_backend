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
        const hashedPassword = await bcrypt.hash(password, 10)

        // Comprobar el usuario admin
        const isFirstUser = (await UserModel.countDocuments()) === 0

        // Crear el usuario y guardar en la DB
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: isFirstUser,
        })

        console.log('JWT_SECRET existe?', !!process.env.JWT_SECRET)
        console.log('JWT_SECRET:', process.env.JWT_SECRET)

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
            httpOnly: true, // no pueden acceder al token desde el front utilizando el atajo document.cookie
            secure: process.env.NODE_ENV === 'production', //true // la cookie solamente se puede enviar desde https por parte de seguridad
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // El token puede viajar desde distintas plataformas y sitios, ya que el front puede estar en vercel y el back en render. lax cuando estamos en desarrollo y bloquea algunas peticiones
            maxAge: 60 * 60 * 1000, // Duracion del token 1h
        })
            .status(201)
            .json({ meessage: 'Usuario registrado con exito' })
    } catch (error) {
        console.error('Error en registerUser:', error)
        return res.status(500).json({
            message: 'Error interno al registrar usuario',
            error: error.message,
        })
    }
}

export const profile = async (req, res) => {
    try {
        // Extraer el accesToken enviado por el cliente
        const token = req.cookies.accessToken

        if (!token) {
            return res
                .status(401)
                .json({ message: 'No autenticado, token no encontrado' })
        }

        // Verificar o decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('datos decodificados del usuario', decoded)

        // Buscar el usuario en la base de datos
        const user = await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        console.log(
            'USUARIO ENCONTRADO CON EXITO Y enviando al front datos del usuario'
        )
        res.status(200).json({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            username: user.username,
        })
    } catch (error) {
        console.error('Error en profile:', error)
        return res.status(401).json({ message: 'Token inválido o expirado' })
    }

    return {
        user: 'test user',
    }
}
